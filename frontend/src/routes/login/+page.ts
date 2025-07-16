import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { authStore } from '$lib/stores/auth';
import { base } from '$app/paths';
import { get } from 'svelte/store';

export const load: PageLoad = async () => {
	// If we're in the browser and already authenticated, redirect to home
	if (browser) {
		const state = get(authStore);
		if (state.isAuthenticated) {
			throw redirect(302, base + '/');
		}
	}

	return {};
};
