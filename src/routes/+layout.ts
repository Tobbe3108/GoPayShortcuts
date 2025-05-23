import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { loadUserFromStorage, validateToken } from '$lib/services/auth';

export const load: LayoutLoad = async ({ url, fetch }) => {
    // Skip auth check for login page
    if (url.pathname === '/login') {
        return {};
    }

    // Check for auth token in browser environment
    if (typeof window !== 'undefined') {
        const user = loadUserFromStorage();
        
        if (!user || !user.token) {
            throw redirect(302, '/login');
        }

        // Validate token
        try {
            const isValid = await validateToken(user.token, fetch);
            if (!isValid) {
                throw redirect(302, '/login');
            }
        } catch (error) {
            throw redirect(302, '/login');
        }
    }

    return {};
};
