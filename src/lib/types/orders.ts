export interface Order {
  id: string;
  deliveryTime: string;
  deliveryLocation: Location;
  orderLines: OrderLine[];
  kitchen: Kitchen;
}

export interface OrderLine {
  productId: number;
  items: number; // quantity
  buyerParty: "PRIVATE"; // const "PRIVATE"
}

export interface Location {
  id: string; // Added ID to Location interface
  name: string;
  kitchen: Kitchen;
  // Any other location properties
}

export interface Kitchen {
  id: number;
  name: string;
}

export interface OrderItemData {
  id: number; // productId
  name: string;
  quantity: number;
  type: 'breakfast' | 'lunch' | 'soda';
}

export interface DayOrderState {
  date: Date;
  selectedLocation: Location | undefined;
  selectedKitchen: Kitchen | undefined;
  breakfastQuantity: number;
  lunchQuantity: number;
  sodaQuantity: number;
  isSaving: boolean;
  saveError: string | null;
  existingOrderId: string | undefined;
  isWeekend?: boolean; // Added for display logic in DayCard
  isToday?: boolean;   // Added for display logic in DayCard
}
