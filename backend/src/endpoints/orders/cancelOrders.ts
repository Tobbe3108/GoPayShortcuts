import {
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../../types";
import { Schemas } from "../Shared/Schemas";
import { DetailedOrder } from "../../goPay/types";
import {
  fetchOrderDetails,
  filterOrders as excludeRefundedOrders,
} from "./shared/ordersUtils";

export class CancelOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Cancel all orders for one or more kitchens on a specific date",
    ...Schemas.BearerAuth(),
    request: {
      body: {
        ...contentJson(
          z.object({
            date: Str({ example: "2024-07-01", required: true }),
            kitchenIds: z
              .array(z.number({ required_error: "kitchenId is required" }))
              .min(1),
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
    const { date, kitchenIds } =
      (data.body as { date: string; kitchenIds: number[] }) ?? {};

    const response = await client.listOrders(date, date);
    if (response instanceof Response) return response; // Error responses

    const details = await fetchOrderDetails(response.orders, client);
    const validOrders = excludeRefundedOrders(details).filter(
      (order) => order.kitchen?.id && kitchenIds.includes(order.kitchen.id)
    );

    if (!allCanBeCanceled(validOrders)) {
      return c.json(
        {
          message: "Orders on the specified date cannot be cancelled",
        },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      validOrders.map(async (order) => {
        const response = await client.deleteOrder(order.id);
        if (response instanceof Response) return { failed: true, response };
        return { failed: false, response: null };
      })
    );

    const anyFailed = results.some((r) => r.failed);
    if (anyFailed) {
      const errorResponses = results
        .filter((r) => r.failed)
        .map((r) => r.response.json() as Promise<any>);
      return c.json(
        {
          errors: (await Promise.all(errorResponses)).map(
            (error) => error.displayMessage || error.details || "Unknown error"
          ),
        },
        { status: 400 }
      );
    }

    return new Response(null, { status: 204 });
  }
}

function allCanBeCanceled(orders: DetailedOrder[]): boolean {
  for (const order of orders) {
    for (const delivery of order.deliveries || []) {
      if (!delivery.cancelOrder?.cancelEnable) {
        return false;
      }
    }
  }
  return true;
}
