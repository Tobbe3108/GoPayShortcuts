const API_BASE_URL = 'https://prod.facilitynet.dk/api';

export interface User {
    token: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

// Local storage key for storing authentication data
const AUTH_STORAGE_KEY = 'food_shortcuts_auth';

// Read user from local storage
export function loadUserFromStorage(): User | null {
    try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
            return JSON.parse(storedAuth);
        }
    } catch (error) {
        console.error('Failed to load auth from storage:', error);
    }
    return null;
}

// Store user in local storage
export function saveUserToStorage(user: User): void {
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
        console.error('Failed to save auth to storage:', error);
    }
}

// Clear user from local storage
export function clearUserFromStorage(): void {
    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear auth from storage:', error);
    }
}

// Request OTP for the provided email
export async function requestOTP(email: string, customFetch?: typeof fetch): Promise<boolean> {
    try {
        const fetchFn = customFetch || fetch;
        const response = await fetchFn(`${API_BASE_URL}/authenticate/username`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Origin': 'https://prod.facilitynet.dk',
                'X-Client-Type': 'mobile-web'
            },
            body: JSON.stringify({ username: email })
        });

        if (!response.ok) {
            throw new Error(`Failed to request OTP: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('OTP request error:', error);
        throw error;
    }
}

// Verify OTP and get authentication token
export async function verifyOTP(otp: string, customFetch?: typeof fetch): Promise<User> {
    try {
        const fetchFn = customFetch || fetch;
        const response = await fetchFn(`${API_BASE_URL}/authenticate/byType`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Origin': 'https://prod.facilitynet.dk',
                'X-Client-Type': 'mobile-web'
            },
            body: JSON.stringify({
                type: 'ACTIVATION_CODE',
                value: otp
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to verify OTP: ${response.statusText}`);
        }

        const data = await response.json();
        const token = data.authentication?.token;

        if (!token) {
            throw new Error('Authentication token not found in response');
        }

        // Get the email from local storage (stored during OTP request)
        const email = localStorage.getItem('temp_email') || '';
        localStorage.removeItem('temp_email'); // Clean up temporary email

        const user: User = {
            token,
            email
        };

        // Save user data to local storage
        saveUserToStorage(user);

        return user;
    } catch (error) {
        console.error('OTP verification error:', error);
        throw error;
    }
}

// Validate if the current token is still valid
export async function validateToken(token: string, customFetch?: typeof fetch): Promise<boolean> {
    try {
        const fetchFn = customFetch || fetch;
        const response = await fetchFn(`${API_BASE_URL}`, {
            method: 'GET',
            headers: {
                'x-api-key': token,
                'Accept': '*/*',
                'Origin': 'https://prod.facilitynet.dk',
                'X-Client-Type': 'mobile-web'
            }
        });

        // For this API, 404 means success (token is valid)
        // 400 means failure (token is invalid)
        return response.status === 404;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}

// Logout function
export function logout(): void {
    clearUserFromStorage();
}
