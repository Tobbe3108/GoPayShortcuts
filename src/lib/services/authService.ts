import authStore from '$lib/stores/authStore';
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
        authStore.update(state => ({ ...state, loading: false }));
        return;
    }

    try {
        const storedAuthDataString = localStorage.getItem(AUTH_KEY);
        if (storedAuthDataString) {
            const storedAuthData: StoredAuthData = JSON.parse(storedAuthDataString);
            // apiService will use the token from localStorage
            // Store only UserType (id, email) in the authStore
            authStore.update(state => ({ ...state, user: { id: storedAuthData.id, email: storedAuthData.email }, loading: false }));
        } else {
            authStore.update(state => ({ ...state, user: null, loading: false }));
        }
    } catch (error) {
        console.error('Failed to load auth from storage', error);
        authStore.update(state => ({ ...state, user: null, loading: false, error: 'Error loading session.' }));
        if (browser) localStorage.removeItem(AUTH_KEY);
    }
}

export async function checkAuth(fetchFunction?: typeof fetch): Promise<void> {
    authStore.update(state => ({ ...state, loading: true, error: null }));
    const currentStoreState = get(authStore);

    if (!currentStoreState.user) {
        if (browser) {
            const storedAuthDataString = localStorage.getItem(AUTH_KEY);
            if (storedAuthDataString) {
                try {
                    const storedAuthData: StoredAuthData = JSON.parse(storedAuthDataString);
                    authStore.update(state => ({ ...state, user: { id: storedAuthData.id, email: storedAuthData.email }}));
                } catch (e) {
                    localStorage.removeItem(AUTH_KEY);
                    authStore.update(state => ({ ...state, user: null, loading: false }));
                    return;
                }
            } else {
                 authStore.update(state => ({ ...state, user: null, loading: false }));
                 return;
            }
        }
    }

    if (!get(authStore).user) {
        authStore.update(state => ({ ...state, loading: false }));
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
        authStore.update(state => ({ ...state, loading: false, error: null })); // Clear error on success
    } catch (error: any) {
        console.warn('Session validation error or timeout:', error);
        let storeError: string | null = 'Session check failed. Please try logging in again.';
        if (error.message && error.message.includes('timed out')) {
            storeError = 'Session validation timed out. Please check your connection and try again.';
        } else if (error.status === 401) {
            storeError = null; // No specific error message for 401, user will be logged out.
        }

        authStore.update(state => ({
            ...state,
            user: null,
            loading: false,
            error: storeError
        }));

        if (browser) {
            localStorage.removeItem(AUTH_KEY);
        }
    }
}

export async function requestOTP(email: string, fetchFunction?: typeof fetch): Promise<void> {
    authStore.update(state => ({ ...state, loading: true, error: null }));
    try {
        if (browser) {
            localStorage.setItem(EMAIL_KEY, email);
        }
        await api('/authenticate/username', {
            method: 'POST',
            body: { username: email }
        }, fetchFunction);
        authStore.update(state => ({ ...state, loading: false }));
    } catch (error) {
        console.error('OTP request error:', error);
        authStore.update(state => ({
            ...state,
            loading: false,
            error: 'Failed to send verification code. Please try again.'
        }));
        throw error;
    }
}

export async function verifyOTP(otp: string, fetchFunction?: typeof fetch): Promise<void> {
    authStore.update(state => ({ ...state, loading: true, error: null }));
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
        authStore.update(state => ({ ...state, user: userForStore, loading: false, error: null }));
    } catch (error) {
        console.error('OTP verification error:', error);
        authStore.update(state => ({
            ...state,
            user: null,
            loading: false,
            error: 'Failed to verify code. Please try again.'
        }));
        if (browser) {
            localStorage.removeItem(AUTH_KEY);
        }
        throw error;
    }
}

export function logout(): void {
    if (browser) {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(EMAIL_KEY);
    }
    authStore.set({ user: null, loading: false, error: null });
}
