import { browser } from '$app/environment';
import { apiClient } from '$lib/core/api/apiClient';
import { writable, type Writable } from 'svelte/store';
import { notifications } from '$lib/core/notifications/notificationStore';

// Keys for local storage
const AUTH_TOKEN_KEY = 'gopay_shortcuts_token';
const EMAIL_KEY = 'gopay_shortcuts_email';

// Auth store interface
export interface AuthState {
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

// Initial state
const initialState: AuthState = {
	token: null,
	isAuthenticated: false,
	isLoading: false,
	error: null
};

// Create the store
const createAuthStore = () => {
	const store: Writable<AuthState> = writable(initialState);

	// Initialize from local storage if available
	if (browser) {
		const loadFromStorage = () => {
			try {
				const token = localStorage.getItem(AUTH_TOKEN_KEY);

				if (token) {
					store.update((state) => ({
						...state,
						token,
						isAuthenticated: true
					}));
				}
			} catch (error) {
				console.error('Failed to load auth state from storage:', error);
				// Clear potentially corrupted data
				localStorage.removeItem(AUTH_TOKEN_KEY);
			}
		};

		loadFromStorage();
	}

	// Return the store with custom methods
	return {
		subscribe: store.subscribe,

		// Request a one-time password
		async requestOTP(email: string): Promise<void> {
			store.update((state) => ({ ...state, isLoading: true, error: null }));

			if (browser) {
				localStorage.setItem(EMAIL_KEY, email);
			}

			const response = await apiClient.requestOTP(email);
			if (response instanceof Error) {
				const errorMessage = response.message || 'Failed to send verification code';

				store.update((state) => ({
					...state,
					isLoading: false,
					error: errorMessage
				}));

				notifications.error('Failed to send verification code: ' + errorMessage);
				throw response;
			}

			store.update((state) => ({ ...state, isLoading: false }));
		},

		// Verify OTP and login
		async login(otp: string): Promise<void> {
			store.update((state) => ({ ...state, isLoading: true, error: null }));

			const response = await apiClient.login(otp);
			if (response instanceof Error) {
				const errorMessage = response.message || 'Failed to verify code';

				store.update((state) => ({
					...state,
					isLoading: false,
					error: errorMessage
				}));

				throw response;
			}

			const token = response.token;
			if (!token) {
				const error = new Error('No authentication token received');

				store.update((state) => ({
					...state,
					isLoading: false,
					error: error.message
				}));

				notifications.error('No authentication token received: ' + error.message);
				throw error;
			}

			// Update store
			store.update((state) => ({
				...state,
				token,
				isAuthenticated: true,
				isLoading: false
			}));

			// Save to localStorage
			if (browser) {
				localStorage.setItem(AUTH_TOKEN_KEY, token);
				localStorage.removeItem(EMAIL_KEY);
			}
		},

		// Logout user
		logout(): void {
			// Clear localStorage
			if (browser) {
				localStorage.removeItem(AUTH_TOKEN_KEY);
				localStorage.removeItem(EMAIL_KEY);
			}

			// Reset store to initial state
			store.set(initialState);
		},

		// Clear any error
		clearError(): void {
			store.update((state) => ({ ...state, error: null }));
		}
	};
};

// Export auth store instance
export const authStore = createAuthStore();
