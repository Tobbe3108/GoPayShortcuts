import { browser } from '$app/environment';
import { apiClient } from '../services/apiClient';
import { writable, type Writable } from 'svelte/store';

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

			try {
				if (browser) {
					localStorage.setItem(EMAIL_KEY, email);
				}

				await apiClient.requestOTP(email);

				store.update((state) => ({ ...state, isLoading: false }));
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Failed to send verification code';

				store.update((state) => ({
					...state,
					isLoading: false,
					error: errorMessage
				}));

				throw error;
			}
		},

		// Verify OTP and login
		async login(otp: string): Promise<void> {
			store.update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await apiClient.login(otp);
				const token = response.token;

				if (!token) {
					throw new Error('No authentication token received');
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
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to verify code';

				store.update((state) => ({
					...state,
					isLoading: false,
					error: errorMessage
				}));

				throw error;
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
