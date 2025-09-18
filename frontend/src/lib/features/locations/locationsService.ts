import { apiClient } from '$lib/core/api/apiClient';

/**
 * Locations service for accessing location data from the backend
 */
export class LocationsService {
	/**
	 * Get all locations from the API
	 */
	static async getLocations(): Promise<Location[]> {
		try {
			// Fetch locations from API (token is automatically included)
			const locations = await apiClient.getLocations();

			return locations;
		} catch (error) {
			console.error('Failed to fetch locations:', error);
			throw error;
		}
	}
}

// Create a singleton instance
export const locationsService = LocationsService;
