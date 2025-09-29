import { OpenAPIRoute, contentJson, InputValidationException } from "chanfana";
import { z } from "zod";
import { createGoPayClient, AppContext } from "../../types";
import {
  fetchValidOrderDetails,
  buildSimplifiedOrderFromDetailed,
  buildSimplifiedOrderFromProducts,
  createAndPayOrder,
  ProductQuantity,
  cancelOrdersBatch,
} from "./shared/ordersUtils";
import { DetailedOrder } from "../../goPay/types";
import { Schemas } from "../Shared/Schemas";

export class PatchOrdersState extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Update orders for a kitchen and day to match desired state",
    ...Schemas.BearerAuth(),
    request: {
      body: {
        ...contentJson(
          z.object({
            kitchenId: z
              .number()
              .describe("ID of the kitchen where orders will be updated"),
            date: z.string().describe("Date in YYYY-MM-DD format"),
            desiredOrders: z.array(
              z.object({
                productId: z.number().describe("ID of the product"),
                quantity: z
                  .number()
                  .min(0)
                  .describe("Desired quantity (0 to remove)"),
              })
            ),
          })
        ),
      },
    },
    responses: {
      200: {
        description: "List of orders for the week",
        ...contentJson(
          z.object({
            orders: z.array(
              z.object({
                order: z.object({
                  date: z.string(),
                  kitchenId: z.number(),
                  orderLines: z.array(
                    z.object({
                      productId: z.number(),
                      quantity: z.number(),
                      price: z.number(),
                    })
                  ),
                }),
              })
            ),
          })
        ),
      },
      401: {
        description: "Unauthorized",
        ...Schemas.GoPayErrorResponse(),
      },
      ...InputValidationException.schema(),
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    const client = createGoPayClient(c);

    const data = await this.getValidatedData<typeof this.schema>();
    const { kitchenId, date, desiredOrders } = data.body;

    const ordersResp = await client.listOrders(date, date);
    if (ordersResp instanceof Response) return ordersResp;

    const validOrders = await fetchValidOrderDetails(ordersResp.orders, client);
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
      order.deliveries.every((d) => d.cancelOrder?.cancelEnable === true)
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

    // Keep only as many orders as needed to fulfill the desired quantity for each product
    // Cancel all surplus orders, even if they contain the desired product
    // Do not create a new order if the desired quantity is already fulfilled by existing orders
    const toCancel: DetailedOrder[] = [];
    const keptOrders: DetailedOrder[] = [];
    const neededMap = { ...desiredMap };

    // Sort cancelable orders so that single-product orders are preferred for keeping (to minimize splits)
    const sortedOrders = [...cancelableOrders].sort((a, b) => {
      const aLines = a.deliveries.reduce(
        (sum, d) => sum + d.orderLines.length,
        0
      );
      const bLines = b.deliveries.reduce(
        (sum, d) => sum + d.orderLines.length,
        0
      );
      return aLines - bLines;
    });

    for (const order of sortedOrders) {
      let canKeep = true;
      // Check if this order can be used to fulfill any desired quantity
      for (const delivery of order.deliveries) {
        for (const line of delivery.orderLines) {
          if ((neededMap[line.productId] || 0) <= 0) {
            canKeep = false;
            break;
          }
        }
        if (!canKeep) break;
      }
      if (canKeep) {
        // Use this order to fulfill as much as possible
        for (const delivery of order.deliveries) {
          for (const line of delivery.orderLines) {
            neededMap[line.productId] = Math.max(
              0,
              (neededMap[line.productId] || 0) - line.items
            );
          }
        }
        keptOrders.push(order);
      } else {
        toCancel.push(order);
      }
    }

    // Calculate what still needs to be created
    // Only create what is still needed after keeping minimal set
    const toCreate: { productId: number; quantity: number }[] = [];
    for (const [productIdStr, quantity] of Object.entries(neededMap)) {
      if (quantity > 0)
        toCreate.push({ productId: Number(productIdStr), quantity });
    }

    // Cancel orders
    const cancelResults = await cancelOrdersBatch(client, toCancel);
    if (cancelResults instanceof Response) return cancelResults; // Error response

    // Create a single new order if needed
    let createResult: ProductQuantity[] | Response | undefined = undefined;
    if (toCreate.length > 0) {
      createResult = await createAndPayOrder(client, kitchenId, date, toCreate);
    }
    if (createResult instanceof Response) return createResult; // Error response

    // Compose the new order state as an array of SimplifiedOrder
    const simplifiedOrders = [];

    for (const order of fixedOrders) {
      simplifiedOrders.push(
        buildSimplifiedOrderFromDetailed(date, kitchenId, order, false)
      );
    }

    for (const order of keptOrders) {
      simplifiedOrders.push(
        buildSimplifiedOrderFromDetailed(date, kitchenId, order, true)
      );
    }

    if (createResult !== undefined) {
      simplifiedOrders.push(
        await buildSimplifiedOrderFromProducts(
          client,
          date,
          kitchenId,
          createResult,
          true
        )
      );
    }

    return { orders: simplifiedOrders };
  }
}
