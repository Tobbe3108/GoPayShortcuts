import { format } from 'date-fns';
import type { SimplifiedOrder } from '$lib/features/orders/models/SimplifiedOrder';
import { ordersService } from '$lib/features/orders/ordersService';

export async function listOrders(weekStart: Date, weekEnd: Date) {
	return await ordersService.listOrders(weekStart, weekEnd).then((res) =>
		res.reduce(
			(record, order) => {
				if (!record[order.date]) record[order.date] = [];
				record[order.date].push(order);
				return record;
			},
			{} as Record<string, SimplifiedOrder[]>
		)
	);
}

export function ordersByDay(record: Record<string, SimplifiedOrder[]>, date: Date) {
	return record[format(date, 'yyyy-MM-dd')] || [];
}

export function handleOrderChange(
	record: Record<string, SimplifiedOrder[]>,
	newOrderState: SimplifiedOrder[] | undefined
) {
	if (newOrderState) {
		for (const order of newOrderState) {
			updateOrderForKitchen(record, order);
		}
	}
}

export function handleTempChange(
	record: Record<string, SimplifiedOrder[]>,
	tempRecord: Record<string, SimplifiedOrder[]>,
	newOrderState: SimplifiedOrder[] | undefined
) {
	if (newOrderState) {
		for (const order of newOrderState) {
			tempRecord[order.date] =
				tempRecord[order.date]?.filter((o) => o.kitchenId !== order.kitchenId) || [];
			updateOrderForKitchen(record, order);
		}
	}
}

export function handleCancel(
	record: Record<string, SimplifiedOrder[]>,
	date: string,
	kitchenId: number
) {
	record[date] = record[date]?.filter((o) => o.kitchenId !== kitchenId) || [];
}

export function updateOrderForKitchen(
	record: Record<string, SimplifiedOrder[]>,
	order: SimplifiedOrder
) {
	record[order.date] = record[order.date]?.filter((o) => o.kitchenId !== order.kitchenId) || [];
	record[order.date].push(order);
}
