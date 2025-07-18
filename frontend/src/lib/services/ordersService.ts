import { apiClient } from './apiClient';
import type { Order } from '$lib/types/api';

/**
 * Orders service for accessing order data from the backend
 */
export class OrdersService {
	/**
	 * Get orders for a specified date range
	 */
	static async listOrders(startDate: string, endDate: string): Promise<Order[]> {
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
	 * Get orders for the current week
	 * Uses the current date to calculate the start of the week (Monday)
	 * and end of the week (Sunday)
	 */
	static async getOrdersForCurrentWeek(): Promise<Order[]> {
		const today = new Date();
		const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

		// Calculate Monday (start of week)
		const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
		const monday = new Date(today);
		monday.setDate(today.getDate() + mondayOffset);

		// Calculate Sunday (end of week)
		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);

		// Format dates as YYYY-MM-DD
		const startDate = monday.toISOString().split('T')[0];
		const endDate = sunday.toISOString().split('T')[0];

		return this.listOrders(startDate, endDate);
	}
}

// Create a singleton instance
export const ordersService = OrdersService;
