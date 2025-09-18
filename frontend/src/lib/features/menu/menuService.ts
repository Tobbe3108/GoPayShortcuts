import { apiClient } from '$lib/core/api/apiClient';
import type { MenuDay } from './models/menuDay';

/**
 * Menu service for accessing menu data from the backend
 */
export class MenuService {
	/**
	 * Get the current menu from the API
	 */
	static async getMenu(): Promise<MenuDay[]> {
		try {
			// Fetch menu from API (token is automatically included)
			const menu = await apiClient.getMenu();

			return menu;
		} catch (error) {
			console.error('Failed to fetch menu:', error);
			throw error;
		}
	}
}

// Create a singleton instance
export const menuService = MenuService;
