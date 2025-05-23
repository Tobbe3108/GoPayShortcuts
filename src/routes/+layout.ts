import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { loadAuth, checkAuth } from '$lib/services/authService';
import { browser } from '$app/environment';
import authStore from '$lib/stores/authStore';
import { get } from 'svelte/store';

export const load: LayoutLoad = async ({ url, fetch }) => {
    if (browser) {
        // Initialize auth state from localStorage on client-side navigation
        loadAuth();
        // Perform initial session check. `checkAuth` updates the store.
        await checkAuth(fetch);

        const currentAuth = get(authStore);

        if (url.pathname !== '/login' && !currentAuth.user) {
            console.log('Redirecting to login from +layout.ts because no user');
            throw redirect(307, '/login');
        }
        if (url.pathname === '/login' && currentAuth.user) {
            console.log('Redirecting to / from +layout.ts because user exists and on login page');
            throw redirect(307, '/');
        }
    }
    // For SSR, or if checks pass on client, return data to make page aware
    return {
        // You can pass the auth state to child components if needed, though direct store usage is common
        // user: browser ? get(authStore).user : null 
    };
};
