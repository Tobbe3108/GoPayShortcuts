export interface MeyersMenuItem {
  item_name: string;
  item_category: string;
  item_id: string;
  menu_name: string;
  menu_description: string;
  pictograms: Record<string, unknown>;
  labels: Record<string, unknown>;
  allergens: Record<string, unknown>;
}

export interface MeyersMenuDay {
  date: string;
  timestamp: string;
  day_of_week: string;
  items: MeyersMenuItem[];
}

export interface MeyersMenuResponse {
  [date: string]: MeyersMenuDay;
}
