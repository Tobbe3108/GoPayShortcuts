import { writable, get } from 'svelte/store';
import type { User } from '$lib/types/user';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true, // Set initial loading to true
  error: null,
};

const authStore = writable<AuthState>(initialState);

// Helper for Svelte 5 style updates in TypeScript service files
export const updateAuthStore = {
  setUser: (user: User | null) => authStore.update(state => ({ ...state, user })),
  setLoading: (loading: boolean) => authStore.update(state => ({ ...state, loading })),
  setError: (error: string | null) => authStore.update(state => ({ ...state, error })),
  reset: () => authStore.set(initialState),
};

export default authStore;
