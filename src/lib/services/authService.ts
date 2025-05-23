import { writable, get } from 'svelte/store';

const API_BASE_URL = 'https://prod.facilitynet.dk/api';

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
const API_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Origin': 'https://prod.facilitynet.dk',
    'X-Client-Type': 'mobile-web'
};

export function loadAuth(): void {    
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
        localStorage.setItem(EMAIL_KEY, email);
        
        const response = await fetch(`${API_BASE_URL}/authenticate/username`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify({ username: email })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send verification code');
        }
        
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
        const response = await fetch(`${API_BASE_URL}/authenticate/byType`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify({
                type: 'ACTIVATION_CODE',
                value: otp
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to verify code');
        }
        
        const data = await response.json();
        const token = data.authentication?.token;
        
        if (!token) {
            throw new Error('Authentication token not found');
        }
        
        const email = localStorage.getItem(EMAIL_KEY) || '';
        localStorage.removeItem(EMAIL_KEY);
        
        const user: User = { token, email };

        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        
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
        
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'GET',
            headers: {
                'x-api-key': authState.user.token,
                'Accept': '*/*',
                'Origin': 'https://prod.facilitynet.dk',
                'X-Client-Type': 'mobile-web'
            }
        });

        const isValid = response.status === 404;
        
        if (!isValid) {
            logout();
        }

        auth.update(state => ({ ...state, loading: false }));
        return isValid;
    } catch (error) {
        console.error('Auth check error:', error);
        auth.update(state => ({ ...state, loading: false }));
        return false;
    }
}

export function logout(): void {    
    localStorage.removeItem(AUTH_KEY);
    auth.update(state => ({ ...state, user: null }));
}
