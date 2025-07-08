import { contentJson, OpenAPIRoute } from "chanfana";
import { type AppContext, createGoPayClient } from "../types";
import { z } from "zod";
import { Schemas } from "./Shared/Schemas";

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
            displayName: z.string(),
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
    const locations = await client.getLocations();
    if (locations instanceof Response) return locations;
    return c.json(
      locations.map((location) => {
        const kitchen = location.kitchens && location.kitchens[0];
        const webshop = kitchen.webshops && kitchen.webshops[0];
        return {
          displayName: location.name,
          name: kitchen.name,
          kitchenId: kitchen.id,
          webshopId: webshop.uid,
        };
      })
    );
  }
}
