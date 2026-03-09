import {
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../../types";
import { Schemas } from "../Shared/Schemas";
import { seconds } from "../Shared/cacheDuration";

export class GetOrdersForPeriod extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Return raw orders (lightweight) for a specific time period",
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
        description: "Orders for the period (raw)",
        ...contentJson(z.object({ orders: z.array(z.any()) })),
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
    if (ordersResp instanceof Response) return ordersResp;

    c.res.headers.set(
      "Cache-Control",
      `private, max-age=${seconds(10)}, stale-while-revalidate=${seconds(20)}`
    );

    return { orders: ordersResp.orders };
  }
}
