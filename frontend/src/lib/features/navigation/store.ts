import { writable, get, derived, type Writable } from 'svelte/store';

// Navigation store interface
export interface NavigationState {
	currentDate: Date;
	collapsedByDay: Map<string, boolean>;
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
	collapsedByDay: new Map()
};

// Create the store
const createNavigationStore = () => {
	const store: Writable<NavigationState> = writable(initialState);

	// Derived store for backward compatibility - collapsed state for current date
	const collapsed = derived(store, ($store) => {
		const dateKey = formatDateKey($store.currentDate);
		return $store.collapsedByDay.get(dateKey) ?? true;
	});

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

	// Helper function to format date as YYYY-MM-DD
	const formatDateKey = (date: Date): string => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	return {
		subscribe: store.subscribe,
		set: store.set,
		update: store.update,
		collapsed,

		// Navigation methods
		nextDay: () => {
			store.update((state) => {
				const newDate = getNextWeekday(state.currentDate);
				return {
					...state,
					currentDate: newDate
				};
			});
		},

		prevDay: () => {
			store.update((state) => {
				const newDate = getPrevWeekday(state.currentDate);
				return {
					...state,
					currentDate: newDate
				};
			});
		},

		toggleMenu: (date?: Date) => {
			store.update((state) => {
				const targetDate = date ?? state.currentDate;
				const dateKey = formatDateKey(targetDate);
				const newCollapsedByDay = new Map(state.collapsedByDay);
				const currentCollapsed = newCollapsedByDay.get(dateKey) ?? true;
				const newCollapsed = !currentCollapsed;
				newCollapsedByDay.set(dateKey, newCollapsed);
				return {
					...state,
					collapsedByDay: newCollapsedByDay
				};
			});
		},

		collapseMenu: () => {
			store.update((state) => {
				const dateKey = formatDateKey(state.currentDate);
				const newCollapsedByDay = new Map(state.collapsedByDay);
				newCollapsedByDay.set(dateKey, true);
				return {
					...state,
					collapsedByDay: newCollapsedByDay
				};
			});
		},

		expandMenu: () => {
			store.update((state) => {
				const dateKey = formatDateKey(state.currentDate);
				const newCollapsedByDay = new Map(state.collapsedByDay);
				newCollapsedByDay.set(dateKey, false);
				return {
					...state,
					collapsedByDay: newCollapsedByDay
				};
			});
		},

		isCollapsed: (date?: Date): boolean => {
			const state = get(store);
			const targetDate = date ?? state.currentDate;
			const dateKey = formatDateKey(targetDate);
			return state.collapsedByDay.get(dateKey) ?? true;
		},

		setDate: (date: Date) => {
			store.update((state) => {
				return {
					...state,
					currentDate: date
				};
			});
		}
	};
};

// Export the store instance
export const navigationStore = createNavigationStore();
