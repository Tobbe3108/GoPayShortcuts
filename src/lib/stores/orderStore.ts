import { writable } from 'svelte/store';
import type { DayOrderState, Location, Order } from '$lib/types/orders';

interface OrderStoreState {
  weekDays: DayOrderState[];
  locations: Location[];
  isLoading: boolean;
  errorMessage: string | null;
  // Potentially add selectedLocation and other relevant state here
}

const initialOrderState: OrderStoreState = {
  weekDays: [],
  locations: [],
  isLoading: true,
  errorMessage: null,
};

const orderStore = writable<OrderStoreState>(initialOrderState);

export default orderStore;
