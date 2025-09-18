import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { base } from '$app/paths';
import { protectRoute } from '$lib/features/auth/protectedRoute';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	// Check if the user is authenticated
	protectRoute();
	// Get data from parent layout
	await parent();

	// Only allow access in development mode in browser context
	if (browser && import.meta.env.DEV) {
		return {};
	}

	// Otherwise redirect to home
	throw redirect(302, base + '/');
};
