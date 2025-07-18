// API Error type
export interface ApiError {
	status: string;
	details: string;
	displayMessage: string;
	isUserMessage: boolean;
}

// Auth types
export type RequestOTPResponse = Record<string, never>;

export interface LoginResponse {
	token: string;
}

// Location types
export interface Location {
	id: number;
	name: string;
	address: string;
}

// Product types
export interface Product {
	id: number;
	name: string;
	price: number;
}

// Common request options
export interface RequestOptions {
	signal?: AbortSignal;
}

// Event types for components
export interface InputEvent {
	detail: string;
}

export interface FormSubmitEvent<T = Record<string, unknown>> {
	detail: T;
}
