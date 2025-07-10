import { contentJson, OpenAPIRoute } from "chanfana";
import { type AppContext, createGoPayClient } from "../../types";
import { z } from "zod";
import { Schemas } from "../Shared/Schemas";
import { ProductsResponse } from "../../goPay/types";
import { formatAmount } from "../Shared/priceUtils";

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
            menues: z.array(z.any()),
            kitchen: z.any(),
          })
        ),
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

    c.res.headers.set("Cache-Control", "max-age=2629800"); // Cache for 30 days
    return productsResponse;
  }
}

function extractProducts(response: ProductsResponse) {
  return response.menues[0].productGroups
    .find((group) => group.name === "Kantinemad")
    .products.map(
      (product) =>
        ({
          id: product.id,
          name: product.name,
          price: formatAmount(product.price?.amount, product.price?.scale),
        } as GetProductsResponse)
    );
}

type GetProductsResponse = {
  id: number;
  name: string;
  price: number;
};
