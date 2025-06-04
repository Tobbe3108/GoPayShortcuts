import type { ApiOrder, Location, Order, OrderItemData, OrderLine } from "$lib/types/orders";
import { api } from "$lib/services/apiService";
import { DANISH_LOCALE, formatISODateWithOffset } from "$lib/utils/dateUtils";

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

export const orderService = {  async getOrdersForWeek(startDate: Date): Promise<Order[]> {
    try {
      // Import the date utility function
      const { formatDateForApi } = await import("$lib/utils/dateUtils");
      
      // Format dates for API call
      const startDateStr = formatDateForApi(startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      const endDateStr = formatDateForApi(endDate);

      console.log(`Fetching orders between ${startDateStr} and ${endDateStr}`);

      // Get all orders for the week
      const ordersResponse = await api<{orders: ApiOrder[]}>(`/orders?offset=0&limit=50&orderType=LUNCH&deliveredStartDate=${startDateStr}&deliveredEndDate=${endDateStr}`);
      
      if (!ordersResponse.orders || !Array.isArray(ordersResponse.orders)) {
        console.error('Invalid orders response:', ordersResponse);
        return [];
      }

      // Filter out refunded orders by grouping by delivery time and finding pairs
      // where one has orderType LUNCH and one has orderType REFUND
      const ordersByDeliveryTime = new Map<string, ApiOrder[]>();
      
      ordersResponse.orders.forEach(order => {
        if (order.deliveries && order.deliveries.length > 0) {
          const deliveryTime = order.deliveries[0].deliveryTime;
          if (!ordersByDeliveryTime.has(deliveryTime)) {
            ordersByDeliveryTime.set(deliveryTime, []);
          }
          ordersByDeliveryTime.get(deliveryTime)?.push(order);
        }
      });

      // Orders that have NOT been refunded
      const validOrders: ApiOrder[] = [];
        // For each delivery time, check if there are REFUND orders
      for (const [, orders] of ordersByDeliveryTime.entries()) {
        // Group orders by ID to find pairs
        const ordersByPriceAmount = new Map<number, ApiOrder[]>();
        
        orders.forEach(order => {
          const priceAmount = order.price.amount;
          if (!ordersByPriceAmount.has(priceAmount)) {
            ordersByPriceAmount.set(priceAmount, []);
          }
          ordersByPriceAmount.get(priceAmount)?.push(order);
        });
        
        // Find non-refunded orders
        for (const [amount, ordersByAmount] of ordersByPriceAmount.entries()) {
          // Skip negative amounts (those are refunds)
          if (amount <= 0) continue;
          
          // Check if there's a corresponding refund order with negative amount
          const hasRefund = ordersByPriceAmount.has(-amount);
          
          // If there's no refund, add these orders as valid
          if (!hasRefund) {
            validOrders.push(...ordersByAmount);
          }
        }
      }
      
      console.log(`Found ${validOrders.length} valid orders out of ${ordersResponse.orders.length} total`);
      
      // For each valid order, fetch the details
      const detailedOrders = await Promise.all(
        validOrders.map(async order => {
          try {
            const orderDetails = await api<{orders: ApiOrder[]}>(`/orders/${order.id}`);
            return orderDetails.orders[0];
          } catch (error) {
            console.error(`Error fetching details for order ${order.id}:`, error);
            return order; // Return the basic order if detail fetch fails
          }
        })
      );
      
      // Convert to the Order type expected by the app
      return detailedOrders.map(apiOrder => {
        // Get the first delivery and its order lines
        const delivery = apiOrder.deliveries && apiOrder.deliveries[0];
        const orderLines: OrderLine[] = [];
        
        if (delivery && delivery.orderLines) {
          delivery.orderLines.forEach(line => {
            orderLines.push({
              productId: line.productId,
              items: line.items,
              buyerParty: "PRIVATE"
            });
          });
        }          return {
          id: apiOrder.id.toString(),
          deliveryTime: delivery ? delivery.deliveryTime : formatISODateWithOffset(new Date()),
          deliveryLocation: {
            displayName: apiOrder.kitchen.name,
            name: apiOrder.kitchen.name,
            kitchenId: apiOrder.kitchen.id,
            webshopId: ''  // This might need to come from elsewhere
          },
          orderLines,
          orderDetails: apiOrder // Keep the full order details for reference
        };
      });
    } catch (error) {
      console.error('Failed to fetch weekly orders:', error);
      return [];
    }
  },
  async placeOrder(orderData: { 
    deliveryTime: string; 
    deliveryLocation: Location; 
    orderLines: { productId: number; items: number; buyerParty: "PRIVATE" }[];
  }): Promise<Order> {
    try {
      // Step 1: "Food order" call to get payment details
      const paymentDetailsPayload = {
        deliveries: [
          {
            deliveryLocation: {
              name: orderData.deliveryLocation.name
            },
            deliveryTime: orderData.deliveryTime,
            orderLines: orderData.orderLines
          }
        ]
      };

      console.info("Placing payment details with payload:", paymentDetailsPayload);

      // First API call for payment details
      await api(`/suppliers/kitchens/${orderData.deliveryLocation.kitchenId}/payment/paymentDetails/catering`, {
        method: 'POST',
        body: paymentDetailsPayload
      });

      // Step 2: "Food pay" call to place the actual order
      const orderPayload = {
        kitchen: {
          id: orderData.deliveryLocation.kitchenId
        },
        webshop: {
          uid: orderData.deliveryLocation.webshopId
        },
        payment: {
          method: "PAYROLL_DEDUCTION"
        },
        orderNote: "",
        deliveries: [
          {
            deliveryLocation: {
              name: orderData.deliveryLocation.name
            },
            deliveryTime: orderData.deliveryTime,
            orderLines: orderData.orderLines
          }
        ]
      };

      console.info("Placing order with payload:", orderPayload);

      // Send the order to the API
      const response = await api<{orders: ApiOrder[]}>('/orders/catering', {
        method: 'POST',
        body: orderPayload
      });

      if (!response.orders || !response.orders.length) {
        throw new Error('No order returned from API');
      }

      const apiOrder = response.orders[0];
      const delivery = apiOrder.deliveries && apiOrder.deliveries[0];
      return {
        id: apiOrder.id.toString(),
        deliveryTime: delivery ? delivery.deliveryTime : orderData.deliveryTime,
        deliveryLocation: orderData.deliveryLocation,
        orderLines: orderData.orderLines,
        orderDetails: apiOrder
      };
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  },

  async cancelOrder(orderId: string): Promise<void> {
    try {
      await api(`/orders/${orderId}`, { method: 'DELETE' });
      console.log(`Order ${orderId} cancelled successfully`);
    } catch (error) {
      console.error(`Failed to cancel order ${orderId}:`, error);
      throw error;
    }
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
