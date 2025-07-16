import {
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../../types";
import { Schemas } from "../Shared/Schemas";
import { fetchOrderDetails, cancelOrdersBatch } from "./shared/ordersUtils";

export class CancelOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary:
      "Cancel all still cancellable orders for the kitchen on a specific date",
    ...Schemas.BearerAuth(),
    request: {
      body: {
        ...contentJson(
          z.object({
            date: Str({ example: "2024-07-01", required: true }),
            kitchenId: z.number({ required_error: "kitchenId is required" }),
          })
        ),
      },
    },
    responses: {
      "204": {
        description: "Orders cancelled successfully",
      },
      "424": {
        description: "Failed to cancel orders",
        ...contentJson(
          z.object({
            errors: z.array(z.string()),
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
    const { date, kitchenId } =
      (data.body as { date: string; kitchenId: number }) ?? {};

    const response = await client.listOrders(date, date);
    if (response instanceof Response) return response; // Error responses

    const validOrders = await fetchOrderDetails(response.orders, client);
    const filteredOrders = validOrders.filter(
      (order) =>
        order.kitchen?.id === kitchenId &&
        order.deliveries.some((delivery) => delivery.cancelOrder?.cancelEnable)
    );

    const result = await cancelOrdersBatch(client, filteredOrders);
    if (result instanceof Response) return result; // Error responses
    return new Response(null, { status: 204 });
  }
}
