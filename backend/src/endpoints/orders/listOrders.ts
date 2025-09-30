import {
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../../types";
import { Schemas } from "../Shared/Schemas";
import {
  fetchValidOrderDetails,
  buildSimplifiedOrderFromDetailed,
  ProductQuantity,
  buildSimplifiedOrderFromProducts,
} from "./shared/ordersUtils";

export class ListOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Get all orders for a specific time period with details",
    ...Schemas.BearerAuth(),
    request: {
      query: z.object({
        start: Str({
          example: "2024-07-01",
          required: true,
          description: "Start date in YYYY-MM-DD format",
        }),
        end: Str({
          example: "2024-07-07",
          required: true,
          description: "End date in YYYY-MM-DD format",
        }),
      }),
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
    const { start, end } = data.query;

    const ordersResp = await client.listOrders(start, end);
    if (ordersResp instanceof Response) return ordersResp; // Error responses

    const validOrders = await fetchValidOrderDetails(ordersResp.orders, client);
    const combinedProducts: tempOrder[] = [];
    for (const order of validOrders) {
      const delivery = order.deliveries?.[0];
      const date = delivery?.deliveryTime?.slice(0, 10) || "unknown";
      const kitchenId = order.kitchen?.id || NaN;
      const cancelEnabled = order.deliveries.every(
        (d) => !d.cancelOrder || d.cancelOrder.cancelEnable !== false
      );
      const simplifiedOrder = buildSimplifiedOrderFromDetailed(
        date,
        kitchenId,
        order,
        cancelEnabled
      );

      const existing = combinedProducts.find(
        (o) => o.date === date && o.kitchenId === kitchenId
      );
      if (existing) {
        existing.cancelEnabled.push(simplifiedOrder.cancelEnabled);
        simplifiedOrder.orderlines.forEach((ol) => {
          const existProd = existing.products.find(
            (p) => p.productId === ol.productId
          );
          if (existProd) {
            existProd.quantity += ol.quantity;
          } else {
            existing.products.push(ol);
          }
        });
      } else {
        combinedProducts.push({
          date: date,
          kitchenId,
          products: simplifiedOrder.orderlines,
          cancelEnabled: [simplifiedOrder.cancelEnabled],
        });
      }
    }

    const simplifiedOrders = await Promise.all(
      combinedProducts.map(async (order) => {
        return await buildSimplifiedOrderFromProducts(
          client,
          order.date,
          order.kitchenId,
          order.products,
          order.cancelEnabled.some((ce) => ce === true)
        );
      })
    ).then((orders) => orders.sort((a, b) => a.date.localeCompare(b.date)));

    c.res.headers.set("Cache-Control", "max-age=10"); // Cache for 10 seconds
    return { orders: simplifiedOrders };
  }
}

type tempOrder = {
  date: string;
  kitchenId: number;
  products: { productId: number; quantity: number; price: number }[];
  cancelEnabled: boolean[];
};
