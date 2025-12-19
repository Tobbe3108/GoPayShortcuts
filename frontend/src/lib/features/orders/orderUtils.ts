import { format } from 'date-fns';
import type { SimplifiedOrder } from '$lib/features/orders/models/SimplifiedOrder';
import { ordersService } from '$lib/features/orders/ordersService';

export interface TemplateOrder extends SimplifiedOrder {
	tempOrder: boolean;
}

export async function listOrders(weekStart: Date, weekEnd: Date) {
	return await ordersService.listOrders(weekStart, weekEnd).then((res) => toRecord(res));
}

export function ordersByDay(record: Record<string, TemplateOrder[]>, date: Date) {
	return record[format(date, 'yyyy-MM-dd')] || [];
}

export function handleOrderChange(
	record: Record<string, TemplateOrder[]>,
	newOrderState: SimplifiedOrder[] | undefined
) {
	if (newOrderState) {
		for (const order of newOrderState) {
			updateOrderForKitchen(record, { ...order, tempOrder: false });
		}
	}
}

export function handleCancel(
	record: Record<string, TemplateOrder[]>,
	date: string,
	kitchenId: number
) {
	record[date] = record[date]?.filter((o) => o.kitchenId !== kitchenId) || [];
}

export function updateOrderForKitchen(
	record: Record<string, TemplateOrder[]>,
	order: TemplateOrder
) {
	record[order.date] = record[order.date]?.filter((o) => o.kitchenId !== order.kitchenId) || [];
	record[order.date].push(order);
}

// Helper: convert a flat order array into the TemplateOrder record keyed by date
export function toRecord(orders: SimplifiedOrder[]): Record<string, TemplateOrder[]> {
	return orders.reduce(
		(record, order) => {
			if (!record[order.date]) record[order.date] = [];
			record[order.date].push({ ...order, tempOrder: false });
			return record;
		},
		{} as Record<string, TemplateOrder[]>
	);
}
