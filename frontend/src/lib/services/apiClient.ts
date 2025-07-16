import { browser } from '$app/environment';

// API Base URL - environment aware
export const API_BASE_URL = browser ? '/api' : 'http://localhost:8787/api';

// Error type for API responses
export interface ApiError {
	status: string;
	details: string;
	displayMessage: string;
	isUserMessage: boolean;
}

// Request OTP response (empty for 204)
export type RequestOTPResponse = Record<string, never>;

// Login response
export interface LoginResponse {
	token: string;
}

// Location type from backend
export interface Location {
	id: number;
	name: string;
	address: string;
}

// Common request options
interface RequestOptions {
	token?: string;
	signal?: AbortSignal;
}

/**
 * API client that directly maps to our backend endpoints
 */
export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl = API_BASE_URL) {
		this.baseUrl = baseUrl;
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

		if (options.token) {
			headers['Authorization'] = `Bearer ${options.token}`;
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

	// Protected endpoints
	async getLocations(token: string): Promise<Location[]> {
		return this.request<Location[]>('/locations', 'GET', undefined, { token });
	}

	// Additional endpoints can be added here
}

// Export a singleton instance
export const apiClient = new ApiClient();
