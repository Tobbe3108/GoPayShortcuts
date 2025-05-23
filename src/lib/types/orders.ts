export interface Order {
  id: string;
  deliveryTime: string;
  deliveryLocation: Location;
  orderLines: OrderLine[];
}

export interface OrderLine {
  productId: number;
  items: number; // quantity
  buyerParty: "PRIVATE"; // const "PRIVATE"
}

export interface Location {
  displayName: string;
  name: string;
  kitchenId: number;
  webshopId: string;
}

export interface Kitchen {
  id: number;
  name: string;
  webshops?: any[];
}

export interface OrderItemData {
  id: number;
  name: string;
  quantity: number;
  type: 'breakfast' | 'lunch' | 'soda';
}

export interface DayOrderState {
  date: Date;
  selectedLocation: Location | undefined | null; // Allow null
  selectedKitchen?: Kitchen;
  breakfastQuantity: number;
  lunchQuantity: number;
  sodaQuantity: number;
  isSaving: boolean;
  saveError: string | null;
  existingOrderId: string | undefined;
  isWeekend?: boolean; // Added for display logic in DayCard
  isToday?: boolean;   // Added for display logic in DayCard
}
