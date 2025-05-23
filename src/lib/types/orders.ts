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
  hasOrder: boolean;
  order?: Order;
  location: Location;
  kitchen: Kitchen;
  breakfast: number;
  lunch: number;
  soda: number;
}
