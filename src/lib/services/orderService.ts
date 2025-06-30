import type { ApiOrder, Location, Order, OrderItemData, OrderLine } from "$lib/types/orders";
import { api } from "$lib/services/apiService";
import { formatISODateWithOffset } from "$lib/utils/dateUtils";

const getOrdersForWeek = async (startDate: Date): Promise<Order[]> => {
  try {
    const { formatDateForApi } = await import("$lib/utils/dateUtils");
    const start = formatDateForApi(startDate);
    const end = formatDateForApi(new Date(startDate.getTime() + 6 * 86400000));
    console.log(`Fetching orders: ${start} to ${end}`);
    const res = await api<{ orders: ApiOrder[] }>(`/orders?offset=0&limit=50&orderType=LUNCH&deliveredStartDate=${start}&deliveredEndDate=${end}`);
    if (!Array.isArray(res.orders)) return [];
    const lunch = new Map<number, ApiOrder>();
    const refunds = new Map<string, number>();
    res.orders.forEach(o => {
      const d = o.deliveries?.[0]?.deliveryTime;
      const a = Math.abs(o.price.amount);
      const k = `${d}_${a}`;
      if (o.orderType === "LUNCH") lunch.set(o.id, o);
      if (o.orderType === "REFUND") refunds.set(k, (refunds.get(k) || 0) + 1);
    });
    const valid: ApiOrder[] = [];
    for (const o of lunch.values()) {
      const d = o.deliveries?.[0]?.deliveryTime;
      const a = o.price.amount;
      const k = `${d}_${a}`;
      const r = refunds.get(k) || 0;
      if (r > 0) refunds.set(k, r - 1);
      else valid.push(o);
    }
    const details = await Promise.all(valid.map(async o => {
      try {
        const d = await api<{ orders: ApiOrder[] }>(`/orders/${o.id}`);
        return d.orders[0];
      } catch (e) {
        console.error(`Order detail fail ${o.id}`, e);
        return o;
      }
    }));
    return details.map(order => {
      const delivery = order.deliveries?.[0];
      const orderLines: OrderLine[] = delivery?.orderLines?.map(l => ({
        productId: l.productId,
        items: l.items,
        buyerParty: "PRIVATE"
      })) || [];
      const loc = order.kitchen?.id ? {
        displayName: order.kitchen.name,
        name: order.kitchen.name,
        kitchenId: order.kitchen.id,
        webshopId: ''
      } : {
        displayName: '', name: '', kitchenId: 0, webshopId: ''
      };
      return {
        id: order.id.toString(),
        deliveryTime: delivery?.deliveryTime || formatISODateWithOffset(new Date()),
        deliveryLocation: loc,
        orderLines,
        orderDetails: order
      };
    });
  } catch (e) {
    console.error('Fetch orders fail', e);
    return [];
  }
};

const placeOrder = async (orderData: {
  deliveryTime: string
  deliveryLocation: Location
  orderLines: { productId: number; items: number; buyerParty: "PRIVATE" }[]
}): Promise<Order> => {
  try {
    const paymentDetailsPayload = {
      deliveries: [{
        deliveryLocation: { name: orderData.deliveryLocation.name },
        deliveryTime: orderData.deliveryTime,
        orderLines: orderData.orderLines
      }]
    };
    console.info("Placing payment details", paymentDetailsPayload);
    await api(`/suppliers/kitchens/${orderData.deliveryLocation.kitchenId}/payment/paymentDetails/catering`, {
      method: 'POST', body: paymentDetailsPayload
    });
    const orderPayload = {
      kitchen: { id: orderData.deliveryLocation.kitchenId },
      webshop: { uid: orderData.deliveryLocation.webshopId },
      payment: { method: "PAYROLL_DEDUCTION" },
      orderNote: "",
      deliveries: [{
        deliveryLocation: { name: orderData.deliveryLocation.name },
        deliveryTime: orderData.deliveryTime,
        orderLines: orderData.orderLines
      }]
    };
    console.info("Placing order", orderPayload);
    const res = await api<{ orders: ApiOrder[] }>('/orders/catering', {
      method: 'POST', body: orderPayload
    });
    if (!res.orders?.length) throw new Error('No order returned');
    const apiOrder = res.orders[0];
    const delivery = apiOrder.deliveries?.[0];
    return {
      id: apiOrder.id.toString(),
      deliveryTime: delivery?.deliveryTime || orderData.deliveryTime,
      deliveryLocation: orderData.deliveryLocation,
      orderLines: orderData.orderLines,
      orderDetails: apiOrder
    };
  } catch (e) {
    console.error('Place order fail', e);
    throw e;
  }
};

const placeAdditionalOrder = (orderData: Parameters<typeof placeOrder>[0]) => placeOrder(orderData);

const cancelOrder = async (orderId: string) => {
  try {
    await api(`/orders/${orderId}`, { method: 'DELETE' });
    console.log(`Order ${orderId} cancelled`);
  } catch (e) {
    console.error(`Cancel order fail ${orderId}`, e);
    throw e;
  }
};

const DEFAULT_ORDER_KEY = "defaultOrderPreferences";

const saveDefaultOrder = (orderItems: OrderItemData[], location: Location | undefined) => {
  try {
    const d = { location, items: orderItems.map(i => ({ id: i.id, quantity: i.quantity, type: i.type, name: i.name })) };
    localStorage.setItem(DEFAULT_ORDER_KEY, JSON.stringify(d));
  } catch (e) {
    console.error("Save default order fail", e);
  }
};

const getDefaultOrder = (): { items: OrderItemData[]; location: Location | undefined } | null => {
  try {
    const saved = localStorage.getItem(DEFAULT_ORDER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items)) return parsed;
    }
    return null;
  } catch (e) {
    console.error("Get default order fail", e);
    return null;
  }
};

export const orderService = {
  getOrdersForWeek,
  placeOrder,
  placeAdditionalOrder,
  cancelOrder,
  saveDefaultOrder,
  getDefaultOrder
};
