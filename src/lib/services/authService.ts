import authStore, { updateAuthStore } from '$lib/stores/authStore';
import { get } from 'svelte/store';
import { api } from './apiService';
import { browser } from '$app/environment';
import type { User as UserType } from '$lib/types/user';

const AUTH_KEY = 'food_shortcuts_auth';
const EMAIL_KEY = 'food_shortcuts_email';

// This interface is for the object stored in localStorage, which includes the token.
interface StoredAuthData extends UserType {
    token: string;
}

export function loadAuth(): void {
    if (!browser) {
        updateAuthStore.setLoading(false);
        return;
    }

    try {
        console.debug('Loading auth from localStorage');
        const storedAuthDataString = localStorage.getItem(AUTH_KEY);
        if (storedAuthDataString) {
            const storedAuthData: StoredAuthData = JSON.parse(storedAuthDataString);
            // apiService will use the token from localStorage
            // Store only UserType (id, email) in the authStore
            updateAuthStore.setUser({ id: storedAuthData.id, email: storedAuthData.email });
            updateAuthStore.setLoading(false);
            console.debug('Auth loaded from localStorage:', storedAuthData);
        } else {
            updateAuthStore.setUser(null);
            updateAuthStore.setLoading(false);
            console.debug('No auth data found in localStorage');
        }
    } catch (error) {
        console.error('Failed to load auth from storage', error);
        updateAuthStore.setUser(null);
        updateAuthStore.setLoading(false);
        updateAuthStore.setError('Error loading session.');
        if (browser) localStorage.removeItem(AUTH_KEY);
    }
}

export async function checkAuth(fetchFunction?: typeof fetch): Promise<void> {
    console.debug('Checking authentication status');

    updateAuthStore.setLoading(true);
    updateAuthStore.setError(null);
    if (!get(authStore).user) {
        console.debug('No user in auth store');
        updateAuthStore.setLoading(false);
        return;
    }

    try {
        const timeout = 8000; // 8 seconds timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`API call to /users/me timed out after ${timeout}ms`)), timeout)
        );

        await Promise.race([
            api('/users/me', { method: 'GET' }, fetchFunction),
            timeoutPromise
        ]);        
        updateAuthStore.setLoading(false);
        updateAuthStore.setError(null); // Clear error on success
        console.debug('Session validation successful');
    } catch (error: any) {
        console.warn('Session validation error or timeout:', error);
        let storeError: string | null = 'Session check failed. Please try logging in again.';
        if (error.message && error.message.includes('timed out')) {
            storeError = 'Session validation timed out. Please check your connection and try again.';
        } else if (error.status === 401) {
            storeError = null; // No specific error message for 401, user will be logged out.
        }

        updateAuthStore.setUser(null);
        updateAuthStore.setLoading(false);
        updateAuthStore.setError(storeError);

        console.debug('Clearing auth data due to session validation failure', storeError);

        if (browser) {
            localStorage.removeItem(AUTH_KEY);
        }
    }
}

export async function requestOTP(email: string, fetchFunction?: typeof fetch): Promise<void> {
    console.debug('Requesting OTP for email:', email);

    updateAuthStore.setLoading(true);
    updateAuthStore.setError(null);
    try {
        if (browser) {
            localStorage.setItem(EMAIL_KEY, email);
        }
        await api('/authenticate/username', {
            method: 'POST',
            body: { username: email }
        }, fetchFunction);  
        console.debug('OTP request successful for email:', email);

        updateAuthStore.setLoading(false);
    } catch (error) {
        console.error('OTP request error:', error);
        updateAuthStore.setLoading(false);
        updateAuthStore.setError('Failed to send verification code. Please try again.');
        throw error;
    }
}

export async function verifyOTP(otp: string, fetchFunction?: typeof fetch): Promise<void> {
    console.debug('Verifying OTP:', otp);
    updateAuthStore.setLoading(true);
    updateAuthStore.setError(null);
    let email = '';
    if (browser) {
        email = localStorage.getItem(EMAIL_KEY) || '';
    }

    try {
        const data = await api('/authenticate/byType', {
            method: 'POST',
            body: {
                type: 'ACTIVATION_CODE',
                value: otp,
                username: email // Assuming API might need username for OTP verification context
            }
        }, fetchFunction);
        console.debug('OTP verification response:', data);

        const token = data.authentication?.token;
        // Assuming the API response for verifyOTP might also include user details like id.
        // If not, you might need to fetch user details in a separate call after getting the token.
        const userId = data.user?.id || data.authentication?.userId || 'temp-id'; // Adapt based on actual API response

        if (!token) {
            throw new Error('Authentication token not found');
        }

        const userForStore: UserType = { id: userId, email };
        const authDataToStore: StoredAuthData = { ...userForStore, token };

        if (browser) {
            localStorage.setItem(AUTH_KEY, JSON.stringify(authDataToStore));
            localStorage.removeItem(EMAIL_KEY);
        }        
        updateAuthStore.setUser(userForStore);
        updateAuthStore.setLoading(false);
        updateAuthStore.setError(null);
    } catch (error) {
        console.error('OTP verification error:', error);
        updateAuthStore.setUser(null);
        updateAuthStore.setLoading(false);
        updateAuthStore.setError('Failed to verify code. Please try again.');
        if (browser) {
            localStorage.removeItem(AUTH_KEY);
        }
        throw error;
    }
}

export function logout(): void {
    console.debug('Logging out user');
    if (browser) {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(EMAIL_KEY);
    }
    updateAuthStore.reset(); // Uses our new helper function
}
