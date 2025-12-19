import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Schemas } from "../Shared/Schemas";
import { AppContext, createMeyersClient } from "../../types";
import { days } from "../Shared/cacheDuration";

export class GetMenu extends OpenAPIRoute {
  schema = {
    tags: ["Menu"],
    summary: "Get the current Meyers menu (simplified)",
    responses: {
      200: {
        description: "Simplified menu data from Meyers",
        ...contentJson(
          z.array(
            z.object({
              date: z.string().describe("Date in YYYY-MM-DD format"),
              items: z.array(Schemas.MenuItemSchema()),
            })
          )
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
        items: day.items.map((item: any) => {
          let parts: string[] = GetItemParts(item);
          return {
            item: parts[0],
            subItems: parts.length > 1 ? parts.slice(1) : [],
            category: item.item_category,
            allergens: Object.entries(item.allergens || {})
              .filter(([_, v]) => v === true)
              .map(([k]) => k),
          };
        }),
      });
    }

    c.res.headers.set("Cache-Control", `max-age=${days(1)}`);
    return result;
  }
}

export type SimplifiedMenuDay = {
  date: string;
  items: {
    item: string;
    subItems: string[];
    category: string;
    allergens: string[];
  }[];
};

function GetItemParts(item: any) {
  let parts: string[];

  if (item.menu_name.includes("-")) {
    parts = item.menu_name.split("-").map((s: string) => s.trim());
  } else {
    parts = [item.menu_name.trim()];
  }

  return parts;
}
