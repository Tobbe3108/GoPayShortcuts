import { Order, DetailedOrder, ProductsResponse } from "../../../goPay/types";
import { GoPayClient } from "../../../goPay/client";
import { formatAmount } from "../../Shared/priceUtils";
import { extractProducts } from "../../Shared/productUtils";

export type ProductQuantity = { productId: number; quantity: number };

export type SimplifiedOrder = {
  date: string;
  kitchenId: number;
  orderlines: { productId: number; quantity: number; price: number }[];
  cancelEnabled: boolean;
};

export type DeliveryLocation = {
  name: string;
  kitchenId: number;
  webshopUid: string;
};

export async function fetchValidOrderDetails(
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

  const refundedOrders = new Set<number>();
  for (const order of details) {
    if (order.creditNoteDetails?.creditNoteOrderIds?.length > 0) {
      refundedOrders.add(order.id);
    }
  }

  return details.filter(
    (order) => order.orderType !== "REFUND" && !refundedOrders.has(order.id)
  );
}

export function buildSimplifiedOrderFromDetailed(
  date: string,
  kitchenId: number,
  order: DetailedOrder,
  cancelEnabled: boolean
): SimplifiedOrder {
  const orderlines: { productId: number; quantity: number; price: number }[] =
    [];

  order.deliveries.forEach((delivery) => {
    delivery.orderLines.forEach((line) => {
      const existing = orderlines.find((ol) => ol.productId === line.productId);
      if (existing) existing.quantity += line.items;
      else
        orderlines.push({
          productId: line.productId,
          quantity: line.items,
          price: formatAmount(line.price.amount, line.price.scale),
        });
    });
  });
  orderlines.sort((a, b) => a.productId - b.productId);
  return { date, kitchenId, orderlines, cancelEnabled };
}

export async function buildSimplifiedOrderFromProducts(
  client: GoPayClient,
  date: string,
  kitchenId: number,
  products: ProductQuantity[],
  cancelEnabled: boolean
): Promise<SimplifiedOrder> {
  const productsWithPrices = await client.getProducts(kitchenId);
  const productsResponse = extractProducts(
    productsWithPrices as ProductsResponse
  );

  const orderlines = products.map(({ productId, quantity }) => ({
    productId,
    quantity,
    price: productsResponse.find((p) => p.id === productId)?.price || 0,
  }));

  orderlines.sort((a, b) => a.productId - b.productId);
  return { date, kitchenId, orderlines, cancelEnabled };
}

export async function getDeliveryLocation(
  client: GoPayClient,
  kitchenId?: number
): Promise<DeliveryLocation | Response> {
  const locationsResponse = await client.getLocations();
  if (locationsResponse instanceof Response) return locationsResponse;

  const location = locationsResponse.find((location) =>
    location.kitchens.find((kitchen) => kitchen.id === kitchenId)
  );
  if (!location) return new Response("Kitchen not found", { status: 404 });

  return {
    name: location.name,
    kitchenId: location.kitchens[0].id,
    webshopUid: location.kitchens[0].webshops[0].uid,
  };
}

export async function createAndPayOrder(
  client: GoPayClient,
  kitchenId: number,
  date: string,
  products: ProductQuantity[]
): Promise<ProductQuantity[] | Response> {
  const deliveryLocation = await getDeliveryLocation(client, kitchenId);
  if (deliveryLocation instanceof Response) return deliveryLocation;

  const deliveries: import("../../../goPay/types").OrderDelivery[] = [
    {
      deliveryLocation: { name: deliveryLocation.name },
      deliveryTime: `${date}T00:00:00.000+02:00`,
      orderLines: products.map(({ productId, quantity }) => ({
        productId,
        items: quantity,
        buyerParty: "PRIVATE",
      })),
    },
  ];

  const orderResp = await client.placeOrder(
    deliveryLocation.kitchenId,
    deliveries
  );
  if (orderResp instanceof Response) return orderResp;

  const paymentResp = await client.payOrder(
    deliveryLocation.kitchenId,
    deliveryLocation.webshopUid,
    deliveries
  );
  if (paymentResp instanceof Response) return paymentResp;

  return products;
}

export async function cancelOrdersBatch(
  client: GoPayClient,
  orders: { id: number }[]
): Promise<Response | null> {
  const responses = await Promise.all(
    orders.map(async (order) => {
      const response = await client.deleteOrder(order.id);
      if (response instanceof Response) return response;
      return null; // Indicate success
    })
  );
  const failed = responses.filter((r) => r instanceof Response);
  if (failed.length > 0) {
    return new Response(
      JSON.stringify({
        errors: await Promise.all(
          failed.map(async (r) => (await r.json()) || "Unknown error")
        ),
      }),
      { status: 400 }
    );
  }

  return null; // All successful
}
