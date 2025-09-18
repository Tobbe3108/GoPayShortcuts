import type { OrderLine } from './orderLine';

export interface Order {
	date: string;
	kitchenId: number;
	orderlines: OrderLine[];
	cancelEnabled: boolean;
	// These fields might be added by the backend later
	id?: number;
	kitchenName?: string;
	status?: string;
	totalPrice?: number;
}
