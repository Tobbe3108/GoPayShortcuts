export interface ApiOrder {
  displayName: string;
  id: number;
  orderType: string;
  organizers: {
    name: string;
  }[];
  deliveries: ApiDelivery[];
  price: Price;
  kitchen: {
    id: number;
    name: string;
  };
  isMasterOrder: boolean;
  uid?: string;
}

export interface ApiDelivery {
  id: number;
  deliveryType: string;
  deliveryTime: string;
  price: Price;
  cancelEnable?: boolean;
  orderLines?: ApiOrderLine[];
  cancelOrder?: {
    cancelEnable: boolean;
  };
}

export interface ApiOrderLine {
  id: number;
  items: number;
  itemPrice: Price;
  price: Price;
  productId: number;
  name: string;
  buyerParty: string;
}

export interface Price {
  amount: number;
  scale: number;
  currency: string;
  formatted: string;
}

export interface Order {
  id: string;
  deliveryTime: string;
  deliveryLocation: Location;
  orderLines: OrderLine[];
  orderDetails?: ApiOrder;
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
  orderDetails?: {
    orderLines: {
      id: number;
      name: string;
      items: number;
    }[];
    price?: {
      amount: number;
      formatted: string;
    };
  };
}
