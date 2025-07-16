import { authStore } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { get } from 'svelte/store';

/**
 * Protects a route by checking if the user is authenticated.
 * If not authenticated, redirects to the login page.
 */
export function protectRoute() {
	const isAuthenticated = get(authStore).isAuthenticated;

	if (!isAuthenticated) {
		console.debug('Protected route: User is not authenticated, redirecting to login');
		throw redirect(302, base + '/login');
	}
}
