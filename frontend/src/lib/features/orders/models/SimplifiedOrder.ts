import type { OrderLine } from './orderLine';

export interface SimplifiedOrder {
	date: string;
	kitchenId: number;
	orderlines: OrderLine[];
	cancelEnabled: boolean;
}
