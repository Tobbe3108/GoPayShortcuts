import { apiClient } from '$lib/core/api/apiClient';
import { notifications } from '$lib/core/notifications/notificationStore';
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
		const response = await apiClient.listOrders(startDate, endDate);

		if (response instanceof Error) {
			console.error('Failed to fetch orders:', response);
			notifications.error('Failed to fetch orders: ' + response.message);
			throw response;
		}

		console.log('Fetched orders:', response.orders);
		return response.orders;
	}

	/**
	 * Update orders for a kitchen and day to match desired state
	 */
	static async updateDay(req: UpdateDayRequest): Promise<SimplifiedOrder[]> {
		const response = await apiClient.updateDay(req);

		if (response instanceof Error) {
			console.error('Failed to update day orders:', response);
			notifications.error('Failed to update day orders: ' + response.message);
			throw response;
		}

		console.log('Updated orders:', response.orders);
		return response.orders;
	}
}

// Create a singleton instance
export const ordersService = OrdersService;
