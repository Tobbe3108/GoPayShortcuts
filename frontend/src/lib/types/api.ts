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

// Menu types
export interface MenuItem {
	name: string;
	category: string;
	allergens: string[];
}

export interface MenuDay {
	date: string;
	items: MenuItem[];
}

// Order types
export interface OrderLine {
	productId: number;
	quantity: number;
	price: number;
}

export interface Order {
	date: string;
	kitchenId: number;
	orderlines: OrderLine[];
	cancelEnabled: boolean;
	// These fields might be added by the backend later
	id?: number;
	kitchenName?: string;
	status?: string;
	totalPrice?: number;
}

export interface OrdersResponse {
	orders: Order[];
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
