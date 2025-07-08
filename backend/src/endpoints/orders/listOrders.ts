import {
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../../types";
import { Schemas } from "../Shared/Schemas";
import { GetOrderDetailsResponse } from "../../goPay/types";

export class ListOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Get all orders for a specific time period with details",
    ...Schemas.BearerAuth(),
    request: {
      query: z.object({
        start: Str({ example: "2025-07-07", required: true }),
        end: Str({ example: "2025-07-11", required: true }),
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

    //TODO: Filter orders that are cancelled

    const details: GetOrderDetailsResponse[] = [];
    await Promise.all(
      ordersResp.orders.map(async (order) => {
        const detail = await client.getOrderDetails(order.id);
        if (!(detail instanceof Response)) details.push(detail);
      })
    );

    //TODO: Simplify response structure
    // Combine all orders on a day into a single order with x orderlines
    // Each orderline should contain the dish, quantity, price, kitchenId and any other relevant information.

    return c.json({ orders: details });
  }
}
