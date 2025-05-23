import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { loadAuth, checkAuth } from '$lib/services/authService';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ url }) => {
    if (url.pathname === '/login') {
        return { isLoginPage: true };
    }
    
    if (!browser) {
        return { isBrowser: false };
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
