import type { LayoutLoad } from './$types';
import { loadAuth, checkAuth } from '$lib/services/authService';
import { browser } from '$app/environment';
import authStore from '$lib/stores/authStore';
import { get } from 'svelte/store';

// Enable static site generation
export const prerender = true;
export const ssr = false;

// Flag to prevent multiple session checks
let hasCheckedAuth = false;

export const load: LayoutLoad = async ({ fetch }) => {
    if (browser) {
        const currentAuth = get(authStore);
        
        if (!currentAuth.user) {
            loadAuth();
            hasCheckedAuth = false;
        }

        if (!hasCheckedAuth) {
            try {
                await checkAuth(fetch);
                hasCheckedAuth = true;
            } catch (error) {
                console.error('Auth check failed:', error);
                // Don't set hasCheckedAuth=true here so we'll try again next navigation
            }
        }
    }
    
    return {};
};
