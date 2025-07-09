import { Order, DetailedOrder } from "../../../goPay/types";
import { GoPayClient } from "../../../goPay/client";

export async function fetchOrderDetails(
  orders: Order[],
  client: GoPayClient
): Promise<DetailedOrder[]> {
  const details: DetailedOrder[] = [];
  await Promise.all(
    orders.map(async (order) => {
      const detail = await client.getOrderDetails(order.id);
      if (!(detail instanceof Response)) details.push(detail);
    })
  );
  return details;
}

export function filterOrders(orders: DetailedOrder[]): DetailedOrder[] {
  const refundedOrders = new Set<number>();
  for (const order of orders) {
    if (order.creditNoteDetails?.creditNoteOrderIds?.length > 0) {
      refundedOrders.add(order.id);
    }
  }
  return orders.filter(
    (order) => order.orderType !== "REFUND" && !refundedOrders.has(order.id)
  );
}
