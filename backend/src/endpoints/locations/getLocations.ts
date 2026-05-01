import { contentJson, OpenAPIRoute } from "chanfana";
import { type AppContext, createGoPayClient } from "../../types";
import { z } from "zod";
import { Schemas } from "../Shared/Schemas";
import { days } from "../Shared/cacheDuration";

export class GetLocations extends OpenAPIRoute {
  schema = {
    tags: ["Locations"],
    summary: "Get available locations",
    ...Schemas.BearerAuth(),
    responses: {
      200: {
        description: "List of locations",
        ...contentJson(z.array(Schemas.LocationSchema())),
      },
      401: {
        description: "Unauthorized",
        ...Schemas.GoPayErrorResponse(),
      },
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    console.log('[GetLocations] handle called');
    const client = createGoPayClient(c);
    const response = await client.getLocations();
    if (response instanceof Response) {
      console.log('[GetLocations] error response status=%d', response.status);
      return response;
    }

    console.log('[GetLocations] got %d locations', response.length);
    const locations = response.map((location) => {
      const kitchen = location.kitchens && location.kitchens[0];
      return {
        kitchenId: kitchen.id,
        name: location.name,
      } as GetLocationsResponse;
    });

    c.res.headers.set(
      "Cache-Control",
      `public, max-age=${days(30)}, stale-while-revalidate=${days(60)}`
    );
    return locations;
  }
}

type GetLocationsResponse = {
  kitchenId: number;
  name: string;
};
