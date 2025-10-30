import { apiClient } from '$lib/core/api/apiClient';
import { notifications } from '$lib/core/notifications/notificationStore';
import type { Product } from './product';

/**
 * Products service for accessing product data from the backend
 */
export class ProductsService {
	/**
	 * Get all products from the API
	 */
	static async getProducts(): Promise<Product[]> {
		// Fetch products from API (token is automatically included)
		const products = await apiClient.getProducts();

		if (products instanceof Error) {
			console.error('Failed to fetch products:', products);
			notifications.error('Failed to fetch products: ' + products.message);
			throw products;
		}

		console.log('Fetched products:', products);
		return products;
	}
}

// Create a singleton instance
export const productsService = ProductsService;
