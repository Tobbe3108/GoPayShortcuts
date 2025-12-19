// Types for updateDay endpoint

export interface UpdateDayRequest {
	kitchenId: number;
	date: string; // YYYY-MM-DD
	desiredOrders: Array<{
		productId: number;
		quantity: number;
	}>;
}
