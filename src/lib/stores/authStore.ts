import { writable } from 'svelte/store';
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

export default authStore;
