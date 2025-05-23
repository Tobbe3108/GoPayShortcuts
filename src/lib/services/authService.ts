import { writable, get } from 'svelte/store';
import { api, API_BASE_URL } from './apiService';
import { browser } from '$app/environment';

export interface User {
    token: string;
    email: string;
}

export const auth = writable<{
    user: User | null;
    loading: boolean;
    error: string | null;
}>({
    user: null,
    loading: true,
    error: null
});

const AUTH_KEY = 'food_shortcuts_auth';
const EMAIL_KEY = 'food_shortcuts_email';

export function loadAuth(): void {    
    if (!browser) {
        auth.update(state => ({ ...state, loading: false }));
        return;
    }
    
    try {
        const storedUser = localStorage.getItem(AUTH_KEY);
        if (storedUser) {
            const user = JSON.parse(storedUser);
            auth.update(state => ({ ...state, user }));
            // Note: We don't set loading to false here that will be done after checkAuth() completes
        }
    } catch (error) {
        console.error('Failed to load auth from storage', error);
    }
}

export async function requestOTP(email: string): Promise<void> {
    auth.update(state => ({ ...state, loading: true, error: null }));
    
    try {
        if (browser) {
            localStorage.setItem(EMAIL_KEY, email);
        }
        
        await api('/authenticate/username', {
            method: 'POST',
            body: { username: email }
        });
        
        auth.update(state => ({ ...state, loading: false }));
    } catch (error) {
        console.error('OTP request error:', error);
        auth.update(state => ({ 
            ...state, 
            loading: false, 
            error: 'Failed to send verification code. Please try again.'
        }));
        throw error;
    }
}

export async function verifyOTP(otp: string): Promise<void> {    
    auth.update(state => ({ ...state, loading: true, error: null }));
    
    try {
        const data = await api('/authenticate/byType', {
            method: 'POST',
            body: {
                type: 'ACTIVATION_CODE',
                value: otp
            }
        });
        
        const token = data.authentication?.token;
        
        if (!token) {
            throw new Error('Authentication token not found');
        }
        
        let email = '';
        if (browser) {
            email = localStorage.getItem(EMAIL_KEY) || '';
            localStorage.removeItem(EMAIL_KEY);
        }
        
        const user: User = { token, email };

        if (browser) {
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        }
        
        auth.update(state => ({ ...state, user, loading: false }));
    } catch (error) {
        console.error('OTP verification error:', error);
        auth.update(state => ({ 
            ...state, 
            loading: false, 
            error: 'Invalid verification code. Please try again.'
        }));
        throw error;
    }
}

export async function checkAuth(): Promise<boolean> {       
    const authState = get(auth);
    if (!authState.user?.token) {
        auth.update(state => ({ ...state, loading: false }));
        return false;
    }
    
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            await api('', { method: 'GET' });
            // Note: This API always returns 404 when authenticated properly
            auth.update(state => ({ ...state, loading: false }));
            return true;
        } catch (error: any) {
            // Check if it's a 404 error, which is actually successful authentication
            if (error?.message?.includes('API error 404')) {
                auth.update(state => ({ ...state, loading: false }));
                return true;
            }
            throw error;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        auth.update(state => ({ ...state, loading: false }));
        logout();
        return false;
    }
}

export function logout(): void {    
    if (browser) {
        localStorage.removeItem(AUTH_KEY);
    }
    auth.update(state => ({ ...state, user: null }));
}
