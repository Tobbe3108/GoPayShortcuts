import { contentJson, OpenAPIRoute } from "chanfana";
import { type AppContext, createGoPayClient } from "../../types";
import { z } from "zod";
import { Schemas } from "../Shared/Schemas";
import { extractProducts } from "../Shared/productUtils";
import { days } from "../Shared/cacheDuration";

export class GetProducts extends OpenAPIRoute {
  schema = {
    tags: ["Products"],
    summary: "Get available products",
    request: {
      query: {
        description:
          "Optional kitchen id to restrict products to a specific kitchen",
        content: {
          "application/json": {
            schema: z.object({ kitchenId: z.number().optional() }),
          },
        },
      },
    },
    ...Schemas.BearerAuth(),
    responses: {
      200: {
        description: "Products for the given kitchen (today)",
        ...contentJson(
          z.object({
            menues: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                products: z.array(Schemas.ProductSchema()),
              })
            ),
            kitchen: z.object({
              id: z.number(),
              name: z.string(),
            }),
          })
        ),
      },
      401: {
        description: "Unauthorized",
        ...Schemas.GoPayErrorResponse(),
      },
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    const client = createGoPayClient(c);

    const locations = await client.getLocations();
    if (locations instanceof Response) return locations;

    // Allow callers to request products for a specific kitchen
    const kitchenIdParam = c.req.query("kitchenId");
    let kitchenId: number | undefined;
    if (kitchenIdParam) {
      const parsed = Number(kitchenIdParam);
      if (Number.isNaN(parsed)) return c.text("Invalid kitchenId", 400);
      kitchenId = parsed;
    }

    const response = await client.getProducts(kitchenId);
    if (response instanceof Response) return response;

    const productsResponse = extractProducts(response);
    c.res.headers.set(
      "Cache-Control",
      `private, max-age=${days(30)}, stale-while-revalidate=${days(60)}`
    );
    return productsResponse;
  }
}
