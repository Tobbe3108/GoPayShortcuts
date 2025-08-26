import type {
	ApiError,
	RequestOTPResponse,
	LoginResponse,
	Location,
	RequestOptions,
	Product,
	MenuDay,
	OrdersResponse,
	UpdateDayRequest,
	UpdateDayResponse
} from '$lib/types/api';

import { API_BASE_URL } from '$lib/config/environment';
import { authStore } from '$lib/stores/auth';
import { get } from 'svelte/store';

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

	async listOrders(startDate: string, endDate: string): Promise<OrdersResponse> {
		return this.request<OrdersResponse>(`/orders?start=${startDate}&end=${endDate}`, 'GET');
	}

	async updateDay(req: UpdateDayRequest): Promise<UpdateDayResponse> {
		return this.request<UpdateDayResponse>('/orders', 'PATCH', req);
	}
}

// Export a singleton instance
export const apiClient = new ApiClient();
