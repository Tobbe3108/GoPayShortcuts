import { MeyersMenuResponse, MeyersMenuDay, MeyersMenuItem } from "./types";

export class MenuDataProcessor {
  static trimStringFields(obj: any): any {
    if (typeof obj === "string") return obj.trimEnd();
    if (Array.isArray(obj)) return obj.map(MenuDataProcessor.trimStringFields);
    if (obj && typeof obj === "object") {
      const out: any = {};
      for (const k in obj) out[k] = MenuDataProcessor.trimStringFields(obj[k]);
      return out;
    }
    return obj;
  }

  static extractMenuItems(data: any): MeyersMenuResponse {
    const targetOfferId = "ob6V4HfZK9Gs95sii4Cf";
    const dateMenus: MeyersMenuResponse = {};
    if (
      !data?.offers ||
      !data.offers[targetOfferId] ||
      !data.offers[targetOfferId].items
    )
      return dateMenus;
    const items = data.offers[targetOfferId].items;
    for (const item of items) {
      if (!item.dates) continue;
      for (const [dateTimestamp, dateInfoRaw] of Object.entries(item.dates)) {
        const dateInfo = dateInfoRaw as { available?: boolean; menu?: any };
        if (!dateInfo || !dateInfo.available || !dateInfo.menu) continue;
        const menu = dateInfo.menu;
        const date = new Date(Number(dateTimestamp) * 1000);
        const dateStr = date.toISOString().slice(0, 10);
        if (!dateMenus[dateStr]) {
          dateMenus[dateStr] = {
            date: dateStr,
            timestamp: dateTimestamp,
            day_of_week: date.toLocaleDateString("en-US", { weekday: "long" }),
            items: [],
          };
        }
        const menuItem: MeyersMenuItem = {
          item_name: item.name,
          item_category: item.category,
          item_id: item.id,
          menu_name: menu.name || "",
          menu_description: menu.description || "",
          pictograms: menu.pictograms || {},
          labels: menu.labels || {},
          allergens: menu.allergens || {},
        };
        dateMenus[dateStr].items.push(
          MenuDataProcessor.trimStringFields(menuItem)
        );
      }
    }
    return dateMenus;
  }
}
