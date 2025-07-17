import { contentJson, OpenAPIRoute } from "chanfana";
import { type AppContext, createGoPayClient } from "../../types";
import { z } from "zod";
import { Schemas } from "../Shared/Schemas";
import { extractProducts } from "../Shared/productUtils";

export class GetProducts extends OpenAPIRoute {
  schema = {
    tags: ["Products"],
    summary: "Get available products",
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

    const response = await client.getProducts(locations[0].kitchens[0].id);
    if (response instanceof Response) return response;

    const productsResponse = extractProducts(response);
    c.res.headers.set("Cache-Control", `max-age=${86400 * 30}`);
    return productsResponse;
  }
}
