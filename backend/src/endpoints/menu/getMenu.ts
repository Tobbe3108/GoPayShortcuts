import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Schemas } from "../Shared/Schemas";
import { AppContext, createMeyersClient } from "../../types";

export class GetMenu extends OpenAPIRoute {
  schema = {
    tags: ["Menu"],
    summary: "Get the current Meyers menu (simplified)",
    ...Schemas.BearerAuth(),
    responses: {
      200: {
        description: "Simplified menu data from Meyers",
        ...contentJson(
          z.object({
            date: z.string(),
            items: z.array(
              z.object({
                name: z.string(),
                category: z.string(),
                allergens: z.array(z.string()),
              })
            ),
          })
        ),
      },
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    const client = createMeyersClient(c);
    const response = await client.getMenu();
    if (response instanceof Response) return response;

    const result: SimplifiedMenuDay[] = [];
    for (const [date, day] of Object.entries(response)) {
      result.push({
        date,
        items: day.items.map((item: any) => ({
          name: item.menu_name,
          category: item.item_category,
          allergens: Object.entries(item.allergens || {})
            .filter(([_, v]) => v === true)
            .map(([k]) => k),
        })),
      });
    }

    return result;
  }
}

export type SimplifiedMenuDay = {
  date: string;
  items: {
    name: string;
    category: string;
    allergens: string[];
  }[];
};
