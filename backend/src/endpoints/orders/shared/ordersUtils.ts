import { Order, DetailedOrder, ProductsResponse } from "../../../goPay/types";
import { GoPayClient } from "../../../goPay/client";
import { formatAmount } from "../../Shared/priceUtils";
import { extractProducts } from "../../Shared/productUtils";

export type ProductQuantity = {
  productId: number;
  quantity: number;
  name?: string;
};

export type SimplifiedOrder = {
  date: string;
  kitchenId: number;
  orderlines: {
    productId: number;
    quantity: number;
    price: number;
    name?: string;
  }[];
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

  // Limit concurrency to avoid exceeding Cloudflare Workers' subrequest limits.
  // Process orders in small batches instead of firing all fetches at once.
  const BATCH_SIZE = 8;
  for (let i = 0; i < orders.length; i += BATCH_SIZE) {
    const batch = orders.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (order) => {
        try {
          const detail = await client.getOrderDetails(order.id);
          return detail instanceof Response ? null : detail;
        } catch (err) {
          // Swallow individual order failures and continue with others
          console.error(`Failed to fetch details for order ${order.id}:`, err);
          return null;
        }
      })
    );

    for (const d of batchResults) {
      if (d) details.push(d);
    }
  }

  const refundedOrders = new Set<number>();
  for (const order of details) {
    if (order.creditNoteDetails?.creditNoteOrderIds?.length > 0) {
      refundedOrders.add(order.id);
    }
  }

  return details.filter(
    (order) => order.orderType !== "REFUND" && order.orderType !== "POS" && !refundedOrders.has(order.id)
  );
}

export function buildSimplifiedOrderFromDetailed(
  date: string,
  kitchenId: number,
  order: DetailedOrder,
  cancelEnabled: boolean
): SimplifiedOrder {
  const orderlines: {
    productId: number;
    quantity: number;
    price: number;
    name?: string;
  }[] = [];

  order.deliveries.forEach((delivery) => {
    delivery.orderLines.forEach((line) => {
      const existing = orderlines.find((ol) => ol.productId === line.productId);
      if (existing) existing.quantity += line.items;
      else
        orderlines.push({
          productId: line.productId,
          quantity: line.items,
          price: formatAmount(line.price.amount, line.price.scale),
          name: line.name,
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

  const catalogById = new Map(
    productsResponse.map((product) => [product.id, product])
  );
  const catalogByName = new Map(
    productsResponse.map((product) => [product.name, product])
  );

  const orderlines = products.map(({ productId, quantity, name }) => {
    let matched = catalogById.get(productId);

    if (!matched && name) {
      matched = catalogByName.get(name);
    }

    const resolvedProductId = matched?.id ?? productId;

    return {
      productId: resolvedProductId,
      quantity,
      price: matched?.price ?? 0,
      name,
    };
  });

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
  // Batch delete requests to avoid too many parallel subrequests.
  const responses: (Response | null)[] = [];
  const BATCH_SIZE = 8;
  for (let i = 0; i < orders.length; i += BATCH_SIZE) {
    const batch = orders.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (order) => {
        try {
          const response = await client.deleteOrder(order.id);
          return response instanceof Response ? response : null;
        } catch (err) {
          console.error(`Failed to delete order ${order.id}:`, err);
          return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
        }
      })
    );
    responses.push(...batchResults);
  }
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
