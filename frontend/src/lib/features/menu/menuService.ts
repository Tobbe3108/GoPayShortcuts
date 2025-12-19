import { apiClient } from '$lib/core/api/apiClient';
import { notifications } from '$lib/core/notifications/notificationStore';
import type { MenuDay } from './models/menuDay';

/**
 * Menu service for accessing menu data from the backend
 */
export class MenuService {
	/**
	 * Get the current menu from the API
	 */
	static async getMenu(): Promise<MenuDay[]> {
		// Fetch menu from API (token is automatically included)
		const menu = await apiClient.getMenu();

		if (menu instanceof Error) {
			console.error('Failed to fetch menu:', menu);
			notifications.error('Failed to fetch menu: ' + menu.message);
			throw menu;
		}

		console.log('Fetched menu:', menu);
		return menu;
	}
}

// Create a singleton instance
export const menuService = MenuService;
