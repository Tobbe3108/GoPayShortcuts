import { authStore } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { get } from 'svelte/store';

/**
 * Checks if a route is protected and redirects to login if user is not authenticated
 *
 * Usage example:
 * ```ts
 * // In your +page.ts file:
 * import { protectRoute } from '$lib/utils/protectedRoute';
 *
 * export function load() {
 *   protectRoute();
 *
 *   return {
 *     // your data here
 *   };
 * }
 * ```
 */
export function protectRoute() {
	const isAuthenticated = get(authStore).isAuthenticated;

	if (!isAuthenticated) {
		console.debug('Protected route: User is not authenticated, redirecting to login');
		throw redirect(302, base + '/login');
	}
}
