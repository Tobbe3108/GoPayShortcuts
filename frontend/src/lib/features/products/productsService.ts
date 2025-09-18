import { apiClient } from '$lib/core/api/apiClient';
import type { Product } from './product';

/**
 * Products service for accessing product data from the backend
 */
export class ProductsService {
	/**
	 * Get all products from the API
	 */
	static async getProducts(): Promise<Product[]> {
		try {
			// Fetch products from API (token is automatically included)
			const products = await apiClient.getProducts();

			return products;
		} catch (error) {
			console.error('Failed to fetch products:', error);
			throw error;
		}
	}
}

// Create a singleton instance
export const productsService = ProductsService;
