import type { Location, Order, OrderItemData } from "$lib/types/orders";
import { api } from "$lib/services/apiService";

// In-memory store for mock orders
let mockOrders: Order[] = [];

export const locationService = {
  async getLocations(): Promise<Location[]> {
    try {
      const response = await api<any[]>('/organization/company/user/locations');
      console.log("Locations fetched raw: ", response);
      
      // Transform the complex response into the expected Location format
      const transformedLocations = response.map(location => {
        // Take the first kitchen in each location's kitchens array
        const primaryKitchen = location.kitchens && location.kitchens[0];
        if (!primaryKitchen) {
          return null; // Skip locations without kitchens
        }
        
        // Take the first webshop from the kitchen
        const primaryWebshop = primaryKitchen.webshops && primaryKitchen.webshops[0];
        if (!primaryWebshop) {
          return null; // Skip kitchens without webshops
        }
        
        return {
          displayName: location.name,
          name: primaryKitchen.name,
          kitchenId: primaryKitchen.id,
          webshopId: primaryWebshop.uid,
        };


      }).filter(Boolean) as Location[]; // Filter out null entries
      
      console.log("Locations transformed: ", transformedLocations);
      return transformedLocations;
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      throw new Error('Failed to fetch locations');
    }
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
    // Filter mockOrders based on the week of startDate if necessary, or return all for simplicity in mock
    // For this mock, we'll return all orders that fall within the week of the startDate.
    const startOfWeek = new Date(startDate);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekOrders = mockOrders.filter(order => {
        const orderDate = new Date(order.deliveryTime);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
    });
    return Promise.resolve(weekOrders);
  },

  async placeOrder(orderData: { 
    deliveryTime: string; 
    deliveryLocation: Location; 
    orderLines: { productId: number; items: number; buyerParty: "PRIVATE" }[];
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
    const newOrder: Order = {
      id: new Date().getTime().toString(), // Generate a mock ID
      ...orderData,
    };
    mockOrders.push(newOrder);
    return Promise.resolve(newOrder);
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
    mockOrders = mockOrders.filter(order => order.id !== orderId);
    return Promise.resolve();
  },
};

const DEFAULT_ORDER_KEY = "defaultOrderPreferences";

export const localStorageService = {
  saveDefaultOrder(orderItems: OrderItemData[], location: Location | undefined): void { // Allow location to be undefined
    try {
      const defaultOrder = {
        location, // Can be undefined
        // Store all items, even if quantity is 0
        items: orderItems.map(item => ({ id: item.id, quantity: item.quantity, type: item.type, name: item.name })),
      };
      localStorage.setItem(DEFAULT_ORDER_KEY, JSON.stringify(defaultOrder));
    } catch (error) {
      console.error("Error saving default order to local storage:", error);
    }
  },

  getDefaultOrder(): { items: OrderItemData[]; location: Location | undefined } | null { // Allow location to be undefined
    try {
      const saved = localStorage.getItem(DEFAULT_ORDER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic validation, location can be null/undefined
        if (parsed && Array.isArray(parsed.items)) {
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
