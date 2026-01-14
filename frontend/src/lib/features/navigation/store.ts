import { writable, type Writable } from 'svelte/store';

// Navigation store interface
export interface NavigationState {
	currentDate: Date;
	collapsed: boolean;
}

// Initial state - today's date
const getInitialDate = () => {
	const today = new Date();
	// If today is weekend, set to Monday
	const day = today.getDay();
	if (day === 0) {
		// Sunday
		today.setDate(today.getDate() - 6);
	} else if (day === 6) {
		// Saturday
		today.setDate(today.getDate() - 5);
	}
	return today;
};

const initialState: NavigationState = {
	currentDate: getInitialDate(),
	collapsed: false
};

// Create the store
const createNavigationStore = () => {
	const store: Writable<NavigationState> = writable(initialState);

	// Helper function to get next weekday (Monday-Friday)
	const getNextWeekday = (date: Date): Date => {
		const next = new Date(date);
		next.setDate(next.getDate() + 1);
		const day = next.getDay();
		if (day === 0) {
			// Sunday -> Monday
			next.setDate(next.getDate() + 1);
		} else if (day === 6) {
			// Saturday -> Monday
			next.setDate(next.getDate() + 2);
		}
		return next;
	};

	// Helper function to get previous weekday
	const getPrevWeekday = (date: Date): Date => {
		const prev = new Date(date);
		prev.setDate(prev.getDate() - 1);
		const day = prev.getDay();
		if (day === 0) {
			// Sunday -> Friday
			prev.setDate(prev.getDate() - 2);
		} else if (day === 6) {
			// Saturday -> Friday
			prev.setDate(prev.getDate() - 1);
		}
		return prev;
	};

	return {
		subscribe: store.subscribe,
		set: store.set,
		update: store.update,

		// Navigation methods
		nextDay: () => {
			store.update((state) => ({
				...state,
				currentDate: getNextWeekday(state.currentDate)
			}));
		},

		prevDay: () => {
			store.update((state) => ({
				...state,
				currentDate: getPrevWeekday(state.currentDate)
			}));
		},

		toggleMenu: () => {
			store.update((state) => ({
				...state,
				collapsed: !state.collapsed
			}));
		},



		setDate: (date: Date) => {
			store.update((state) => ({
				...state,
				currentDate: date
			}));
		}
	};
};

// Export the store instance
export const navigationStore = createNavigationStore();
