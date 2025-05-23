import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { 
    type AuthState, 
    type User, 
    loadUserFromStorage, 
    validateToken, 
    logout 
} from '$lib/services/auth';

// Initial state
const initialState: AuthState = {
    user: null,
    loading: true,
    error: null
};

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(initialState);
    
    // Initialize auth state from storage when in browser
    async function initialize() {
        if (browser) {
            // Ensure loading state is true when starting validation
            update(state => ({ ...state, loading: true }));
            
            const user = loadUserFromStorage();
            
            if (user) {
                // Validate token when loading from storage
                try {
                    // Add a small delay to ensure the loading state is visible 
                    // to prevent flickering for fast connections
                    const validationPromise = validateToken(user.token);
                    const delayPromise = new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Wait for both the validation and minimum delay
                    await delayPromise;
                    const isValid = await validationPromise;
                    
                    if (isValid) {
                        update(state => ({ ...state, user, loading: false }));
                    } else {
                        // Token not valid anymore
                        logout();
                        update(state => ({ ...state, user: null, loading: false }));
                    }
                } catch (error) {
                    update(state => ({ 
                        ...state, 
                        user: null, 
                        loading: false, 
                        error: 'Failed to validate authentication'
                    }));
                }
            } else {
                // Add a small delay to ensure the loading state is visible
                await new Promise(resolve => setTimeout(resolve, 500));
                update(state => ({ ...state, loading: false }));
            }
        }
    }

    // Set the user in the store
    function setUser(user: User | null) {
        update(state => ({ ...state, user, error: null }));
    }

    // Set error message
    function setError(message: string) {
        update(state => ({ ...state, error: message }));
    }

    // Clear error message
    function clearError() {
        update(state => ({ ...state, error: null }));
    }

    // Set loading state
    function setLoading(loading: boolean) {
        update(state => ({ ...state, loading }));
    }

    // Log out user
    function logoutUser() {
        logout();
        update(state => ({ ...state, user: null, error: null }));
    }

    return {
        subscribe,
        setUser,
        setError,
        clearError,
        setLoading,
        logoutUser,
        initialize
    };
}

export const authStore = createAuthStore();
