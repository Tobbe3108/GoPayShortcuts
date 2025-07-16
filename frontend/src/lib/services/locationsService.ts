import { apiClient } from './apiClient';
import type { Location } from '$lib/types/api';
import { authStore } from '../stores/auth';
import { get } from 'svelte/store';

/**
 * Locations service for accessing location data from the backend
 */
export class LocationsService {
	/**
	 * Get all locations from the API
	 */
	static async getLocations(): Promise<Location[]> {
		// Get auth token
		const auth = get(authStore);
		if (!auth.token) {
			throw new Error('Authentication required to fetch locations');
		}

		try {
			// Fetch locations from API
			const locations = await apiClient.getLocations(auth.token);

			return locations;
		} catch (error) {
			console.error('Failed to fetch locations:', error);
			throw error;
		}
	}

	/**
	 * Get a location by ID
	 */
	static async getLocationById(id: number): Promise<Location | undefined> {
		const locations = await this.getLocations();
		return locations.find((location) => location.id === id);
	}
}

// Create a singleton instance
export const locationsService = LocationsService;
