import { browser } from '$app/environment';
import authStore from '$lib/stores/authStore'; // Changed: import default export
import { get } from 'svelte/store';

export const API_BASE_URL = 'https://prod.facilitynet.dk/api';

const DEFAULT_HEADERS = {
    'Accept': '*/*',
    'Origin': 'https://prod.facilitynet.dk',
    'X-Client-Type': 'mobile-web',
    'Content-Type': 'application/json'
};

export interface ApiOptions {
    method?: string;
    body?: object;
    headers?: Record<string, string>;
}

export async function api<T = any>(
    path: string, 
    options: ApiOptions = {}, 
    fetchFunction?: typeof fetch
): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;
    
    const currentAuthStoreState = get(authStore); // Changed: use authStore
    const authHeaders: Record<string, string> = {};
    
    // To get the token, we need to look into localStorage as StoredAuthData includes the token
    // The authStore.user itself only has id and email.
    if (browser) {
        const storedAuthDataString = localStorage.getItem('food_shortcuts_auth');
        if (storedAuthDataString) {
            try {
                const storedAuthData = JSON.parse(storedAuthDataString);
                if (storedAuthData && storedAuthData.token) {
                    authHeaders['x-api-key'] = storedAuthData.token;
                }
            } catch (e) {
                console.error("Failed to parse auth data from localStorage", e);
            }
        }
    }
    
    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    
    // Use provided fetch function or fall back to global fetch
    const fetchToUse = fetchFunction || (browser ? window.fetch : fetch);
    
    const response = await fetchToUse(url, {
        method,
        headers: {
            ...DEFAULT_HEADERS,
            ...authHeaders,
            ...headers
        },
        body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API error ${response.status}: ${errorText}`);
    }
    
    // For endpoints that don't return JSON
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
    }
    
    return response.json();
}
