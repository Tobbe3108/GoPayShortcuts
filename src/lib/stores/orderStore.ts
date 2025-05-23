import { writable, get } from 'svelte/store';
import type { DayOrderState, Location, Order } from '$lib/types/orders';

interface OrderStoreState {
  weekDays: DayOrderState[];
  locations: Location[];
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  // Potentially add selectedLocation and other relevant state here
}

const initialOrderState: OrderStoreState = {
  weekDays: [],
  locations: [],
  isLoading: true,
  errorMessage: null,
  successMessage: null,
};

const orderStore = writable<OrderStoreState>(initialOrderState);

// Helper for Svelte 5 style updates in TypeScript service files
export const updateOrderStore = {
  setIsLoading: (isLoading: boolean) => 
    orderStore.update(s => ({ ...s, isLoading })),
  
  setLocations: (locations: Location[]) =>
    orderStore.update(s => ({ ...s, locations })),
  
  setWeekDays: (weekDays: DayOrderState[]) =>
    orderStore.update(s => ({ ...s, weekDays })),
    
  setErrorMessage: (errorMessage: string | null) => 
    orderStore.update(s => ({ ...s, errorMessage })),
    
  setSuccessMessage: (successMessage: string | null) => 
    orderStore.update(s => ({ ...s, successMessage })),
  
  updateWeekDay: (date: Date, updates: Partial<DayOrderState>) => {
    orderStore.update(s => ({
      ...s,
      weekDays: s.weekDays.map(day => 
        day.date.toDateString() === date.toDateString() 
          ? { ...day, ...updates } 
          : day
      )
    }));
  },
  
  reset: () => orderStore.set(initialOrderState),
};

export default orderStore;
