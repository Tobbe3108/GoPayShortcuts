import { apiClient } from '$lib/core/api/apiClient';
import type { SimplifiedOrder } from './models/SimplifiedOrder';
import type { UpdateDayRequest } from './models/updateDayRequest';

/**
 * Orders service for accessing order data from the backend
 */
export class OrdersService {
	/**
	 * Get orders for a specified date range
	 */
	static async listOrders(startDate: Date, endDate: Date): Promise<SimplifiedOrder[]> {
		try {
			const response = await apiClient.listOrders(startDate, endDate);
			return response.orders;
		} catch (error) {
			console.error('Failed to fetch orders:', error);
			throw error;
		}
	}

	/**
	 * Update orders for a kitchen and day to match desired state
	 */
	static async updateDay(req: UpdateDayRequest): Promise<SimplifiedOrder[]> {
		try {
			const response = await apiClient.updateDay(req);
			return response.orders;
		} catch (error) {
			console.error('Failed to update day orders:', error);
			throw error;
		}
	}
}

// Create a singleton instance
export const ordersService = OrdersService;
