import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';

// Mock apiClient before importing store
const mockRequestOTP = vi.fn();
const mockLogin = vi.fn();

vi.mock('$lib/core/api/apiClient', () => ({
	apiClient: {
		requestOTP: mockRequestOTP,
		login: mockLogin
	}
}));

// Mock notifications
const mockNotificationsError = vi.fn();

vi.mock('$lib/core/notifications/notificationStore', () => ({
	notifications: {
		error: mockNotificationsError,
		success: vi.fn(),
		info: vi.fn(),
		warning: vi.fn(),
		remove: vi.fn(),
		subscribe: vi.fn()
	}
}));

describe('Auth Store', { timeout: 15000 }, () => {
	// We need to re-import the module for each test to get fresh store state.
	// Use dynamic import + vi.resetModules() for isolation.
	let authStore: Awaited<typeof import('./store')>['authStore'];

	beforeEach(async () => {
		vi.resetModules();
		mockRequestOTP.mockReset();
		mockLogin.mockReset();
		mockNotificationsError.mockReset();
		localStorage.clear();

		// Re-mock after resetModules
		vi.doMock('$lib/core/api/apiClient', () => ({
			apiClient: {
				requestOTP: mockRequestOTP,
				login: mockLogin
			}
		}));
		vi.doMock('$lib/core/notifications/notificationStore', () => ({
			notifications: {
				error: mockNotificationsError,
				success: vi.fn(),
				info: vi.fn(),
				warning: vi.fn(),
				remove: vi.fn(),
				subscribe: vi.fn()
			}
		}));

		const mod = await import('./store');
		authStore = mod.authStore;
	});

	describe('initial state', () => {
		it('starts with unauthenticated state when no token in localStorage', () => {
			const state = get(authStore);

			expect(state.token).toBeNull();
			expect(state.isAuthenticated).toBe(false);
			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();
		});

		it('initializes as authenticated when token exists in localStorage', async () => {
			// Reset and set token before importing
			vi.resetModules();
			localStorage.setItem('gopay_shortcuts_token', 'existing-token');

			vi.doMock('$lib/core/api/apiClient', () => ({
				apiClient: { requestOTP: mockRequestOTP, login: mockLogin }
			}));
			vi.doMock('$lib/core/notifications/notificationStore', () => ({
				notifications: { error: mockNotificationsError, success: vi.fn(), info: vi.fn(), warning: vi.fn(), remove: vi.fn(), subscribe: vi.fn() }
			}));

			const mod = await import('./store');
			const state = get(mod.authStore);

			expect(state.token).toBe('existing-token');
			expect(state.isAuthenticated).toBe(true);
		});
	});

	describe('requestOTP', () => {
		it('sets loading state while requesting', async () => {
			mockRequestOTP.mockResolvedValue({});
			const states: boolean[] = [];

			const unsub = authStore.subscribe((s) => states.push(s.isLoading));
			await authStore.requestOTP('user@example.com');
			unsub();

			// Should have gone: false → true → false
			expect(states).toContain(true);
			expect(states[states.length - 1]).toBe(false);
		});

		it('stores email in localStorage', async () => {
			mockRequestOTP.mockResolvedValue({});

			await authStore.requestOTP('user@example.com');

			expect(localStorage.getItem('gopay_shortcuts_email')).toBe('user@example.com');
		});

		it('clears previous error when requesting', async () => {
			mockRequestOTP.mockResolvedValue({});

			await authStore.requestOTP('user@example.com');

			expect(get(authStore).error).toBeNull();
		});

		it('sets error and notifies when API returns an Error', async () => {
			mockRequestOTP.mockResolvedValue(new Error('Network failure'));

			await expect(authStore.requestOTP('user@example.com')).rejects.toThrow('Network failure');

			const state = get(authStore);
			expect(state.error).toBe('Network failure');
			expect(state.isLoading).toBe(false);
			expect(mockNotificationsError).toHaveBeenCalledWith(
				expect.stringContaining('Network failure')
			);
		});

		it('uses fallback error message when Error has no message', async () => {
			mockRequestOTP.mockResolvedValue(new Error(''));

			await expect(authStore.requestOTP('user@example.com')).rejects.toThrow();

			const state = get(authStore);
			expect(state.error).toBe('Failed to send verification code');
		});
	});

	describe('login', () => {
		it('authenticates user and stores token on successful login', async () => {
			mockLogin.mockResolvedValue({ token: 'jwt-token-123' });

			await authStore.login('123456');

			const state = get(authStore);
			expect(state.token).toBe('jwt-token-123');
			expect(state.isAuthenticated).toBe(true);
			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();
		});

		it('stores token in localStorage and removes email key', async () => {
			localStorage.setItem('gopay_shortcuts_email', 'user@example.com');
			mockLogin.mockResolvedValue({ token: 'jwt-token-123' });

			await authStore.login('123456');

			expect(localStorage.getItem('gopay_shortcuts_token')).toBe('jwt-token-123');
			expect(localStorage.getItem('gopay_shortcuts_email')).toBeNull();
		});

		it('sets error and throws when API returns an Error', async () => {
			mockLogin.mockResolvedValue(new Error('Invalid code'));

			await expect(authStore.login('bad-otp')).rejects.toThrow('Invalid code');

			const state = get(authStore);
			expect(state.error).toBe('Invalid code');
			expect(state.isLoading).toBe(false);
			expect(state.isAuthenticated).toBe(false);
		});

		it('sets error and notifies when response has no token', async () => {
			mockLogin.mockResolvedValue({});

			await expect(authStore.login('123456')).rejects.toThrow(
				'No authentication token received'
			);

			const state = get(authStore);
			expect(state.error).toBe('No authentication token received');
			expect(state.isAuthenticated).toBe(false);
			expect(mockNotificationsError).toHaveBeenCalledWith(
				expect.stringContaining('No authentication token received')
			);
		});

		it('sets loading state while logging in', async () => {
			mockLogin.mockResolvedValue({ token: 'jwt-token-123' });
			const states: boolean[] = [];

			const unsub = authStore.subscribe((s) => states.push(s.isLoading));
			await authStore.login('123456');
			unsub();

			expect(states).toContain(true);
			expect(states[states.length - 1]).toBe(false);
		});
	});

	describe('logout', () => {
		it('resets state to initial values', async () => {
			// First login
			mockLogin.mockResolvedValue({ token: 'jwt-token-123' });
			await authStore.login('123456');

			// Then logout
			authStore.logout();

			const state = get(authStore);
			expect(state.token).toBeNull();
			expect(state.isAuthenticated).toBe(false);
			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();
		});

		it('clears auth data from localStorage', async () => {
			localStorage.setItem('gopay_shortcuts_token', 'some-token');
			localStorage.setItem('gopay_shortcuts_email', 'user@example.com');

			authStore.logout();

			expect(localStorage.getItem('gopay_shortcuts_token')).toBeNull();
			expect(localStorage.getItem('gopay_shortcuts_email')).toBeNull();
		});
	});

	describe('clearError', () => {
		it('clears the error from state', async () => {
			// Trigger an error
			mockRequestOTP.mockResolvedValue(new Error('Some error'));
			await expect(authStore.requestOTP('user@example.com')).rejects.toThrow();
			expect(get(authStore).error).toBe('Some error');

			// Clear it
			authStore.clearError();

			expect(get(authStore).error).toBeNull();
		});
	});
});
