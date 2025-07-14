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
  fetchOrderDetails,
  filterOrders,
  buildSimplifiedOrderFromDetailed,
} from "./shared/ordersUtils";

export class ListOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Get all orders for a specific time period with details",
    ...Schemas.BearerAuth(),
    request: {
      query: z.object({
        start: Str({ example: "2024-07-01", required: true }),
        end: Str({ example: "2024-07-07", required: true }),
      }),
    },
    responses: {
      200: {
        description: "List of detailed orders for the week",
        ...contentJson(
          z.object({
            orders: z.array(
              z.object({
                order: z.any(), // Could be refined to match GetOrderDetailsResponse
              })
            ),
          })
        ),
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

    const details = await fetchOrderDetails(ordersResp.orders, client);
    const filteredOrders = filterOrders(details);

    const simplifiedOrders = filteredOrders.map((order) => {
      const delivery = order.deliveries?.[0];
      const date = delivery?.deliveryTime?.slice(0, 10) || "unknown";
      const kitchenId = order.kitchen?.id || NaN;
      const cancelEnabled = order.deliveries.every(
        (d) => !d.cancelOrder || d.cancelOrder.cancelEnable !== false
      );
      return buildSimplifiedOrderFromDetailed(
        order,
        date,
        kitchenId,
        cancelEnabled
      );
    });

    c.res.headers.set("Cache-Control", "max-age=10"); // Cache for 10 seconds
    return { orders: simplifiedOrders };
  }
}
