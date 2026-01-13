import { writable, type Writable } from 'svelte/store';
import type { SwipeCustomEvent } from 'svelte-gestures';

// Swipe handler type
export type SwipeHandler = (event: SwipeCustomEvent) => void;

// Swipe store interface
export interface SwipeState {
	handler: SwipeHandler | null;
}

// Initial state
const initialState: SwipeState = {
	handler: null
};

// Create the store
const createSwipeStore = () => {
	const store: Writable<SwipeState> = writable(initialState);

	// Return the store with custom methods
	return {
		subscribe: store.subscribe,

		// Set the swipe handler
		setHandler(handler: SwipeHandler | null): void {
			store.update((state) => ({ ...state, handler }));
		},

		// Call the swipe handler if it exists
		handleSwipe(event: SwipeCustomEvent): void {
			store.update((state) => {
				if (state.handler) {
					state.handler(event);
				}
				return state;
			});
		},

		// Clear the handler
		clearHandler(): void {
			store.set(initialState);
		}
	};
};

// Export swipe store instance
export const swipeStore = createSwipeStore();
