import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { loadAuth, checkAuth } from '$lib/services/authService';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ url, fetch }) => {
    if (url.pathname === '/login') {
        return { isLoginPage: true };
    }
    
    if (!browser) {
        // Skip auth check during SSR
        return { isServerSide: true };
    }
    
    loadAuth();
    
    try {
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
