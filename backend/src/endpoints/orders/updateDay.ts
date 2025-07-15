import { OpenAPIRoute, contentJson, InputValidationException } from "chanfana";
import { z } from "zod";
import { createGoPayClient, AppContext } from "../../types";
import {
  fetchOrderDetails,
  buildSimplifiedOrderFromDetailed,
  buildSimplifiedOrderFromProducts,
  createAndPayOrder,
  ProductQuantity,
  cancelOrdersBatch,
} from "./shared/ordersUtils";
import { DetailedOrder } from "../../goPay/types";

export class UpdateDayOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Update orders for a kitchen and day to match desired state",
    ...InputValidationException.schema(),
    request: {
      body: {
        ...contentJson(
          z.object({
            kitchenId: z.number(),
            date: z.string(),
            desiredOrders: z.array(
              z.object({
                productId: z.number(),
                quantity: z.number().min(0),
              })
            ),
          })
        ),
      },
    },
    responses: {
      200: {
        description: "Summary of canceled and created orders",
        ...contentJson(
          z.object({
            canceled: z.array(z.any()),
            created: z.array(z.any()),
          })
        ),
      },
      ...InputValidationException.schema(),
    },
  };

  async handle(c: AppContext) {
    const client = createGoPayClient(c);

    const data = await this.getValidatedData<typeof this.schema>();
    const { kitchenId, date, desiredOrders } = data.body;

    const ordersResp = await client.listOrders(date, date);
    if (ordersResp instanceof Response) return ordersResp;

    const validOrders = await fetchOrderDetails(ordersResp.orders, client);
    const filteredOrders = validOrders.filter(
      (order) => order.kitchen?.id === kitchenId
    );

    // Build a map of desired productId -> quantity
    const desiredMap = Object.fromEntries(
      desiredOrders.map((d) => [d.productId, d.quantity])
    );

    // Build a map of current productId -> quantity (from all orders)
    const currentMap: Record<number, number> = {};
    filteredOrders.forEach((order) => {
      order.deliveries.forEach((delivery) => {
        delivery.orderLines.forEach((line) => {
          currentMap[line.productId] =
            (currentMap[line.productId] || 0) + line.items;
        });
      });
    });

    // Find which orders are fully cancelable
    const cancelableOrders = filteredOrders.filter((order) =>
      order.deliveries.every(
        (d) => !d.cancelOrder || d.cancelOrder.cancelEnable !== false
      )
    );
    const fixedOrders = filteredOrders.filter(
      (order) => !cancelableOrders.includes(order)
    );

    // Calculate the fixed (non-cancelable) product quantities
    const fixedMap: Record<number, number> = {};
    fixedOrders.forEach((order) => {
      order.deliveries.forEach((delivery) => {
        delivery.orderLines.forEach((line) => {
          fixedMap[line.productId] =
            (fixedMap[line.productId] || 0) + line.items;
        });
      });
    });

    // Adjust desiredMap by subtracting fixedMap (cannot remove these)
    for (const [productIdStr, fixedQty] of Object.entries(fixedMap)) {
      const productId = Number(productIdStr);
      if (desiredMap[productId] !== undefined) {
        desiredMap[productId] = Math.max(0, desiredMap[productId] - fixedQty);
      }
    }

    // If any fixedMap quantity exceeds the desired, this is an over-order that cannot be fixed

    // Cancel orders if all their products are not needed in the desiredMap (after fixedMap adjustment)
    const toCancel: DetailedOrder[] = [];
    cancelableOrders.forEach((order) => {
      // Sum up all products in this order
      let needed = false;
      order.deliveries.forEach((delivery) => {
        delivery.orderLines.forEach((line) => {
          if ((desiredMap[line.productId] || 0) > 0) needed = true;
        });
      });
      if (!needed) toCancel.push(order);
    });

    // Calculate what still needs to be created
    // Subtract all cancelable orders' products from desiredMap if they are being canceled
    toCancel.forEach((order) => {
      order.deliveries.forEach((delivery) => {
        delivery.orderLines.forEach((line) => {
          // Add back the canceled quantity to desiredMap
          desiredMap[line.productId] =
            (desiredMap[line.productId] || 0) + line.items;
        });
      });
    });

    // Now, for each productId in desiredMap, collect any remaining quantity > 0 into a single order
    const toCreate: { productId: number; quantity: number }[] = [];
    for (const [productIdStr, quantity] of Object.entries(desiredMap)) {
      if (quantity > 0)
        toCreate.push({ productId: Number(productIdStr), quantity });
    }

    // Cancel orders
    const cancelResults = await cancelOrdersBatch(client, toCancel);
    if (cancelResults instanceof Response) return cancelResults; // Error response

    // Create a single new order if needed
    let createResult: ProductQuantity[] | Response;
    if (toCreate.length > 0) {
      createResult = await createAndPayOrder(client, kitchenId, date, toCreate);
    }
    if (createResult instanceof Response) return createResult; // Error response

    // Compose the new order state as an array of SimplifiedOrder
    const simplifiedOrders = [];
    for (const order of fixedOrders) {
      simplifiedOrders.push(
        buildSimplifiedOrderFromDetailed(order, date, kitchenId, false)
      );
    }

    simplifiedOrders.push(
      buildSimplifiedOrderFromProducts(date, kitchenId, createResult)
    );

    return { orders: simplifiedOrders };
  }
}
