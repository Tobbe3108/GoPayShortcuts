import type { RequestOptions } from './api';
import type { UpdateDayRequest } from '$lib/features/orders/models/updateDayRequest';
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
	): Promise<T | Error> {
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
		console.log('API Response:', response);

		if (response.status === 204) return {} as T;

		if (!response.ok) return new Error(response.statusText || 'An unknown error occurred');

		return response.json();
	}

	// Auth endpoints
	async requestOTP(email: string): Promise<RequestOTPResponse | Error> {
		return await this.request<RequestOTPResponse>('/request-otp', 'POST', { email });
	}

	async login(otp: string): Promise<LoginResponse | Error> {
		return await this.request<LoginResponse>('/login', 'POST', { otp });
	}

	async getLocations(): Promise<Location[] | Error> {
		return await this.request<Location[]>('/locations', 'GET');
	}

	async getProducts(): Promise<Product[] | Error> {
		return await this.request<Product[]>('/products', 'GET');
	}

	async getMenu(): Promise<MenuDay[] | Error> {
		return await this.request<MenuDay[]>('/menu', 'GET');
	}

	async listOrders(startDate: Date, endDate: Date): Promise<OrdersResponse | Error> {
		return await this.request<OrdersResponse>(
			`/orders?start=${format(startDate, 'yyyy-MM-dd')}&end=${format(endDate, 'yyyy-MM-dd')}`,
			'GET'
		);
	}

	async updateDay(req: UpdateDayRequest): Promise<OrdersResponse | Error> {
		return await this.request<OrdersResponse>('/orders', 'PATCH', req);
	}
}

// Export a singleton instance
export const apiClient = new ApiClient();
