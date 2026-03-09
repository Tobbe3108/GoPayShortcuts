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
import { seconds } from "../Shared/cacheDuration";

export class ListOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Get order details for up to 50 order ids",
    ...Schemas.BearerAuth(),
    request: {
      body: {
        ...contentJson(
          z.object({
            orderIds: z.array(z.number()).min(1).max(50),
          })
        ),
      },
    },
    responses: {
      200: {
        description: "Detailed orders for the requested ids",
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
    const { orderIds } = data.body;

    // Fetch details for each id, return only successful responses
    const results = await Promise.all(
      orderIds.map(async (id) => {
        const d = await client.getOrderDetails(id);
        return d instanceof Response ? null : d;
      })
    );
    const details = (results.filter((r) => r !== null) as DetailedOrder[]);

    c.res.headers.set(
      "Cache-Control",
      `private, max-age=${seconds(10)}, stale-while-revalidate=${seconds(20)}`
    );

    // sort deterministically by date if available
    details.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return { orders: details };
  }
}
