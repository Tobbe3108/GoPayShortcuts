import type { UpdateDayOrderProduct } from './updateDayOrderProduct';

export interface UpdateDayOrder {
	orderId: number;
	status: string;
	products: UpdateDayOrderProduct[];
}
