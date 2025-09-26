import type { ApiError, RequestOptions } from './api';
import type { UpdateDayRequest } from '$lib/features/orders/models/update/updateDayRequest';
import type { UpdateDayResponse } from '$lib/features/orders/models/update/updateDayResponse';
import type { RequestOTPResponse } from '$lib/features/auth/models/requestOTPResponse';
import type { LoginResponse } from '$lib/features/auth/models/loginResponse';
import type { Product } from '$lib/features/products/product';
import type { MenuDay } from '$lib/features/menu/models/menuDay';
import type { OrdersResponse } from '$lib/features/orders/models/ordersResponse';
import type { Location } from '$lib/features/locations/location';

import { API_BASE_URL } from '../config/environment';
import { authStore } from '$lib/features/auth/store';
import { get } from 'svelte/store';
import { format } from 'date-fns';

/**
 * API client that directly maps to our backend endpoints
 */
export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl = API_BASE_URL) {
		this.baseUrl = baseUrl;
	}

	// Get the current auth token from the store
	private getAuthToken(): string | null {
		return get(authStore).token;
	}

	// Public request method for legacy compatibility
	async request<T>(
		endpoint: string,
		method: string = 'GET',
		body?: unknown,
		options: RequestOptions = {}
	): Promise<T> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		};

		const token = this.getAuthToken();
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
			signal: options.signal
		});

		// Handle no content responses
		if (response.status === 204) {
			return {} as T;
		}

		// Handle errors
		if (!response.ok) {
			const errorData: ApiError = await response.json();
			throw new Error(errorData.displayMessage || errorData.details || 'An unknown error occurred');
		}

		// Parse response
		return response.json();
	}

	// Auth endpoints
	async requestOTP(email: string): Promise<RequestOTPResponse> {
		return this.request<RequestOTPResponse>('/request-otp', 'POST', { email });
	}

	async login(otp: string): Promise<LoginResponse> {
		return this.request<LoginResponse>('/login', 'POST', { otp });
	}

	async getLocations(): Promise<Location[]> {
		return this.request<Location[]>('/locations', 'GET');
	}

	async getProducts(): Promise<Product[]> {
		return this.request<Product[]>('/products', 'GET');
	}

	async getMenu(): Promise<MenuDay[]> {
		return this.request<MenuDay[]>('/menu', 'GET');
	}

	async listOrders(startDate: Date, endDate: Date): Promise<OrdersResponse> {
		return this.request<OrdersResponse>(
			`/orders?start=${format(startDate, 'yyyy-MM-dd')}&end=${format(endDate, 'yyyy-MM-dd')}`,
			'GET'
		);
	}

	async updateDay(req: UpdateDayRequest): Promise<UpdateDayResponse> {
		return this.request<UpdateDayResponse>('/orders', 'PATCH', req);
	}
}

// Export a singleton instance
export const apiClient = new ApiClient();
