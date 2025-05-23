import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { loadAuth, checkAuth } from '$lib/services/authService';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ url }) => {
    // Skip auth check for login page
    if (url.pathname === '/login') {
        return { isLoginPage: true };
    }
    
    // Skip auth validation during server-side rendering
    if (!browser) {
        // Allow the initial page render, client-side code will handle auth
        return { isBrowser: false };
    }
    
    // Client-side authentication flow
    loadAuth();
    
    try {
        // Check if the token is still valid
        // This will also update the loading state when complete
        const isValid = await checkAuth();
        
        if (!isValid) {
            throw redirect(302, '/login');
        }
        
        return { isAuthenticated: true };
    } catch (error) {
        console.error('Auth check error:', error);
        throw redirect(302, '/login');
    }
};
