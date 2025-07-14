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
            kitchenId: z.number(),
            name: z.string(),
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
      return {
        kitchenId: kitchen.id,
        name: location.name,
      } as GetLocationsResponse;
    });

    c.res.headers.set("Cache-Control", `max-age=${86400 * 30}`); // Cache for 30 days
    return locations;
  }
}

type GetLocationsResponse = {
  kitchenId: number;
  name: string;
};
