import { contentJson, OpenAPIRoute } from "chanfana";
import { type AppContext, createGoPayClient } from "../../types";
import { z } from "zod";
import { Schemas } from "../Shared/Schemas";

export class GetLocations extends OpenAPIRoute {
  schema = {
    tags: ["Locations"],
    summary: "Get available locations",
    ...Schemas.BearerAuth(),
    responses: {
      200: {
        description: "List of locations",
        ...contentJson(
          z.object({
            name: z.string(),
            kitchenId: z.number(),
            webshopId: z.string(),
          })
        ),
      },
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    const client = createGoPayClient(c);
    const response = await client.getLocations();
    if (response instanceof Response) return response; // Error responses

    const locations = response.map((location) => {
      const kitchen = location.kitchens && location.kitchens[0];
      const webshop = kitchen.webshops && kitchen.webshops[0];
      return {
        name: location.name,
        kitchenId: kitchen.id,
        webshopId: webshop.uid,
      } as GetLocationsResponse;
    });

    c.res.headers.set("Cache-Control", "max-age=2629800"); // Cache for 30 days
    return locations;
  }
}

type GetLocationsResponse = {
  name: string;
  kitchenId: number;
  webshopId: string;
};
