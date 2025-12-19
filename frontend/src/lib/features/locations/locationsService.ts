import { apiClient } from '$lib/core/api/apiClient';
import type { Location } from './location';
import { notifications } from '$lib/core/notifications/notificationStore';

/**
 * Locations service for accessing location data from the backend
 */
export class LocationsService {
	/**
	 * Get all locations from the API
	 */
	static async getLocations(): Promise<Location[]> {
		// Fetch locations from API (token is automatically included)
		const locations = await apiClient.getLocations();

		if (locations instanceof Error) {
			console.error('Failed to fetch locations:', locations);
			notifications.error('Failed to fetch locations: ' + locations.message);
			throw locations;
		}

		console.log('Fetched locations:', locations);
		return locations;
	}
}

// Create a singleton instance
export const locationsService = LocationsService;
