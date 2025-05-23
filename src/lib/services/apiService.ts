import { browser } from '$app/environment';
import { auth } from './authService';
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
    
    const authStore = get(auth);
    const authHeaders: Record<string, string> = {};
    
    if (authStore.user?.token) {
        authHeaders['x-api-key'] = authStore.user.token;
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
