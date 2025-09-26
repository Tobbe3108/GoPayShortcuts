import { apiClient } from '$lib/core/api/apiClient';
import type { Order } from './models/order';
import type { UpdateDayRequest } from './models/update/updateDayRequest';
import type { UpdateDayResponse } from './models/update/updateDayResponse';

/**
 * Orders service for accessing order data from the backend
 */
export class OrdersService {
	/**
	 * Get orders for a specified date range
	 */
	static async listOrders(startDate: Date, endDate: Date): Promise<Order[]> {
		try {
			// Fetch orders from API
			const response = await apiClient.listOrders(startDate, endDate);

			// Return the orders array directly from the response
			return response.orders;
		} catch (error) {
			console.error('Failed to fetch orders:', error);
			throw error;
		}
	}

	/**
	 * Update orders for a kitchen and day to match desired state
	 */
	static async updateDay(req: UpdateDayRequest): Promise<UpdateDayResponse> {
		try {
			return await apiClient.updateDay(req);
		} catch (error) {
			console.error('Failed to update day orders:', error);
			throw error;
		}
	}
}

// Create a singleton instance
export const ordersService = OrdersService;
