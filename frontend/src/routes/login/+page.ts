import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { authStore } from '$lib/auth/store';
import { base } from '$app/paths';
import { get } from 'svelte/store';

export const load: PageLoad = async () => {
	if (browser) {
		const state = get(authStore);
		if (state.isAuthenticated) {
			throw redirect(302, base + '/');
		}
	}

	return {};
};
