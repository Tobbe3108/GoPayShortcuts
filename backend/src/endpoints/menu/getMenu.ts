import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Schemas } from "../Shared/Schemas";
import { AppContext, createMeyersClient } from "../../types";

export class GetMenu extends OpenAPIRoute {
  schema = {
    tags: ["Menu"],
    summary: "Get the current Meyers menu",
    ...Schemas.BearerAuth(),
    responses: {
      200: {
        description: "Structured menu data from Meyers",
        ...contentJson(z.any()),
      },
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    const client = createMeyersClient(c);
    const response = await client.getMenu();
    if (response instanceof Response) return response; // Error responses

    return response;
  }
}
