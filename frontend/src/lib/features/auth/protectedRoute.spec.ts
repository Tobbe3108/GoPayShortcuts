import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from '@sveltejs/kit';

// Mock $app/paths (not in global setup)
vi.mock('$app/paths', () => ({
	base: '/gopay'
}));

// Mock @sveltejs/kit redirect
vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn((status: number, location: string) => {
		// SvelteKit redirect throws a special object
		const err = new Error(`Redirect to ${location}`) as any;
		err.status = status;
		err.location = location;
		throw err;
	})
}));

describe('protectRoute', { timeout: 15000 }, () => {
	beforeEach(() => {
		vi.resetModules();
		vi.mocked(redirect).mockClear();
		localStorage.clear();
	});

	it('throws redirect to login when user is not authenticated', async () => {
		// Mock the auth store to return unauthenticated state
		vi.doMock('./store', () => {
			const { readable } = require('svelte/store');
			return {
				authStore: readable({
					token: null,
					isAuthenticated: false,
					isLoading: false,
					error: null
				})
			};
		});

		const { protectRoute } = await import('./protectedRoute');

		expect(() => protectRoute()).toThrow();
		expect(redirect).toHaveBeenCalledWith(302, '/gopay/login');
	});

	it('does not throw when user is authenticated', async () => {
		// Mock the auth store to return authenticated state
		vi.doMock('./store', () => {
			const { readable } = require('svelte/store');
			return {
				authStore: readable({
					token: 'valid-token',
					isAuthenticated: true,
					isLoading: false,
					error: null
				})
			};
		});

		const { protectRoute } = await import('./protectedRoute');

		expect(() => protectRoute()).not.toThrow();
	});

	it('uses the correct base path in redirect URL', async () => {
		vi.doMock('./store', () => {
			const { readable } = require('svelte/store');
			return {
				authStore: readable({
					token: null,
					isAuthenticated: false,
					isLoading: false,
					error: null
				})
			};
		});

		const { protectRoute } = await import('./protectedRoute');

		try {
			protectRoute();
		} catch {
			// Expected to throw
		}

		expect(redirect).toHaveBeenCalledWith(302, '/gopay/login');
	});
});
