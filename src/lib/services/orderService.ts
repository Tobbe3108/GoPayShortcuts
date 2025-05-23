import type { Location, Order, OrderItemData, DayOrderState, Kitchen } from "./types/orders";

const API_BASE_URL = "/api"; // Replace with your actual API base URL if different

export const locationService = {
  async getLocations(): Promise<Location[]> {
    // const response = await fetch(`${API_BASE_URL}/organization/company/user/locations`);
    // if (!response.ok) {
    //   throw new Error("Failed to fetch locations");
    // }
    // return response.json();
    // Mock data for now
    return Promise.resolve([
      { name: "Office A", kitchen: { id: 1, name: "Kitchen A" } },
      { name: "Office B", kitchen: { id: 2, name: "Kitchen B" } },
    ]);
  },
};

export const orderService = {
  async getOrdersForWeek(startDate: Date): Promise<Order[]> {
    // const response = await fetch(`${API_BASE_URL}/orders?weekStartDate=${startDate.toISOString()}`);
    // if (!response.ok) {
    //   throw new Error("Failed to fetch orders");
    // }
    // return response.json();
    // Mock data for now
    console.log("Fetching orders for week starting: ", startDate);
    return Promise.resolve([]); // No orders by default
  },

  async placeOrder(orderData: { 
    deliveryTime: string; 
    deliveryLocation: Location; 
    orderLines: { productId: number; items: number; buyerParty: "PRIVATE" }[]; 
    kitchen: Kitchen;
  }): Promise<Order> {
    // const response = await fetch(`${API_BASE_URL}/orders`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(orderData),
    // });
    // if (!response.ok) {
    //   const errorData = await response.json().catch(() => ({ message: "Failed to place order" }));
    //   throw new Error(errorData.message || "Failed to place order");
    // }
    // return response.json();
    // Mock data for now
    console.log("Placing order: ", orderData);
    return Promise.resolve({
      id: new Date().getTime().toString(), // Generate a mock ID
      ...orderData,
    });
  },

  async cancelOrder(orderId: string): Promise<void> {
    // const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    //   method: "DELETE",
    // });
    // if (!response.ok) {
    //   throw new Error("Failed to cancel order");
    // }
    // return response.json();
    // Mock data for now
    console.log("Cancelling order: ", orderId);
    return Promise.resolve();
  },
};

const DEFAULT_ORDER_KEY = "defaultOrderPreferences";

export const localStorageService = {
  saveDefaultOrder(orderItems: OrderItemData[], location: Location): void {
    try {
      const defaultOrder = {
        location,
        items: orderItems.map(item => ({ id: item.id, quantity: item.quantity, type: item.type, name: item.name })),
      };
      localStorage.setItem(DEFAULT_ORDER_KEY, JSON.stringify(defaultOrder));
    } catch (error) {
      console.error("Error saving default order to local storage:", error);
    }
  },

  getDefaultOrder(): { items: OrderItemData[]; location: Location } | null {
    try {
      const saved = localStorage.getItem(DEFAULT_ORDER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic validation
        if (parsed && parsed.location && Array.isArray(parsed.items)) {
          return parsed;
        }
      }
      return null;
    } catch (error) {
      console.error("Error retrieving default order from local storage:", error);
      return null;
    }
  },
};
