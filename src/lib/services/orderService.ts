import type { ApiOrder, Location, Order, OrderItemData, OrderLine } from "$lib/types/orders";
import { api } from "$lib/services/apiService";
import { DANISH_LOCALE, formatISODateWithOffset } from "$lib/utils/dateUtils";

// Define a type for the location response to avoid using 'any'
interface LocationApiResponse {
  name: string;
  kitchens: Array<{
    id: number;
    name: string;
    webshops?: Array<{
      uid: string;
    }>;
  }>;
}

export const locationService = {
  async getLocations(): Promise<Location[]> {
    try {
      const response = await api<LocationApiResponse[]>('/organization/company/user/locations');
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
      console.log(`Fetched orders for the week from ${startDateStr} to ${endDateStr}`, ordersResponse);      
        // Track LUNCH orders by their unique ID to avoid duplicates
      const lunchOrdersById = new Map<number, ApiOrder>();
      // Track refunds by delivery time and amount
      const refundsByTimeAndAmount = new Map<string, number>();
      
      ordersResponse.orders.sort(order => order.id)

      // Organize all orders
      ordersResponse.orders.forEach(order => {
        if (!order.deliveries || order.deliveries.length === 0) return;
        
        const deliveryTime = order.deliveries[0].deliveryTime;
        const amount = Math.abs(order.price.amount);
        const key = `${deliveryTime}_${amount}`;
        
        if (order.orderType === "LUNCH") {
          lunchOrdersById.set(order.id, order);
        } else if (order.orderType === "REFUND") {
          // Count refunds for each delivery time and amount combination
          refundsByTimeAndAmount.set(key, (refundsByTimeAndAmount.get(key) || 0) + 1);
        }
      });
      
      console.log(`Found ${lunchOrdersById.size} lunch orders`);
      
      // Create an array of valid lunch orders
      const validOrders: ApiOrder[] = [];
      
      // For each lunch order, check if there's a corresponding refund
      for (const order of lunchOrdersById.values()) {
        if (!order.deliveries || order.deliveries.length === 0) continue;
        
        const deliveryTime = order.deliveries[0].deliveryTime;
        const amount = order.price.amount;
        const key = `${deliveryTime}_${amount}`;
        
        // Check if there are refunds for this combination
        const refundCount = refundsByTimeAndAmount.get(key) || 0;
        
        if (refundCount > 0) {
          // This order has a refund, so decrement the refund count
          refundsByTimeAndAmount.set(key, refundCount - 1);
        } else {
          // This order has no refund, so it's valid
          validOrders.push(order);
        }
      }
      
      console.log(`Found ${validOrders.length} valid orders out of ${ordersResponse.orders.length} total`, validOrders);
      
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
        // Group orders by day to combine multiple orders for the same day
      const ordersByDay = new Map<string, ApiOrder[]>();
      
      // Group orders by delivery date
      detailedOrders.forEach(apiOrder => {
        const delivery = apiOrder.deliveries && apiOrder.deliveries[0];
        if (delivery) {
          const deliveryDate = delivery.deliveryTime.split('T')[0]; // Extract YYYY-MM-DD
          if (!ordersByDay.has(deliveryDate)) {
            ordersByDay.set(deliveryDate, []);
          }
          ordersByDay.get(deliveryDate)?.push(apiOrder);
        }
      });        // Combine orders for each day
      return Array.from(ordersByDay.entries()).map(([, orders]) => {
        // Use the first order as the base
        const baseOrder = orders[0];
        const baseDelivery = baseOrder.deliveries && baseOrder.deliveries[0];
        
        // Create a map to track combined quantities by product ID
        const combinedOrderLines = new Map<number, {
          productId: number,
          items: number,
          buyerParty: string,
          name: string
        }>();
        
        // Calculate total price across all orders for this day
        let totalAmount = 0;
        let currency = "";
        let scale = 0;
        
        // Combine order lines from all orders for this day
        orders.forEach(order => {          
          const delivery = order.deliveries && order.deliveries[0];
          if (delivery && delivery.orderLines) {
            if (delivery.price) {
              totalAmount += delivery.price.amount;
              // Use the currency and scale from the first order with a price
              if (!currency && delivery.price.currency) {
                currency = delivery.price.currency;
                scale = delivery.price.scale;
              }
            }

            delivery.orderLines.forEach(line => {
              if (!combinedOrderLines.has(line.productId)) {
                combinedOrderLines.set(line.productId, {
                  productId: line.productId,
                  items: 0,
                  buyerParty: "PRIVATE",
                  name: line.name
                });
              }
              
              const existingLine = combinedOrderLines.get(line.productId);
              if (existingLine) {
                existingLine.items += line.items;
              }
            });
          }
        });
        
        // Format the total price
        const formattedPrice = new Intl.NumberFormat(DANISH_LOCALE, {
          style: 'currency',
          currency: currency || 'DKK',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(totalAmount / Math.pow(10, scale || 2));
        
        // Convert combined map to array
        const orderLines: OrderLine[] = Array.from(combinedOrderLines.values()).map(line => ({
          productId: line.productId,
          items: line.items,
          buyerParty: "PRIVATE"
        }));
        
        // Create combined order details for display
        const combinedOrderDetails = {
          ...baseOrder,
          price: {
            amount: totalAmount,
            scale: scale || 2,
            currency: currency || 'DKK',
            formatted: formattedPrice
          },
          deliveries: baseOrder.deliveries ? [{
            ...baseDelivery,
            orderLines: Array.from(combinedOrderLines.values()).map(line => ({
              id: line.productId,
              items: line.items,
              name: line.name,
              productId: line.productId,
              buyerParty: "PRIVATE",
              price: { amount: 0, scale: 0, currency: "", formatted: "" },
              itemPrice: { amount: 0, scale: 0, currency: "", formatted: "" }
            }))
          }] : []
        };
        
        return {
          id: baseOrder.id.toString(), // Use the first order's ID
          deliveryTime: baseDelivery ? baseDelivery.deliveryTime : formatISODateWithOffset(new Date()),
          deliveryLocation: {
            displayName: baseOrder.kitchen.name,
            name: baseOrder.kitchen.name,
            kitchenId: baseOrder.kitchen.id,
            webshopId: ''
          },
          orderLines,
          orderDetails: combinedOrderDetails
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
