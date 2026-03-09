import { apiClient } from '$lib/core/api/apiClient';
import { notifications } from '$lib/core/notifications/notificationStore';
import type { SimplifiedOrder } from './models/SimplifiedOrder';
import type { UpdateDayRequest } from './models/updateDayRequest';
import { fetchOrderDetailsChunk, fetchOrderIdsForPeriod } from '$lib/core/api/ordersClient';
// NOTE: avoid importing backend source types directly. Define minimal local type shape instead.
type DetailedOrder = {
  id: number;
  date?: string;
  orderType?: string;
  creditNoteDetails?: { creditNoteOrderIds?: number[] };
  deliveries?: Array<{
    deliveryTime?: string;
    orderLines?: Array<{ productId: number; items: number; price?: { amount: number; scale: number }; name?: string }>;
    cancelOrder?: { cancelEnable: boolean } | null;
  }>;
  kitchen?: { id: number } | null;
};

/**
 * Orders service for accessing order data from the backend
 */
export class OrdersService {
	/**
	 * Get orders for a specified date range
	 */
	static async listOrders(startDate: Date, endDate: Date): Promise<SimplifiedOrder[]> {
		// Step 1: fetch IDs for period
		const listResp = await fetchOrderIdsForPeriod(startDate, endDate);

		if (listResp instanceof Error) {
			console.error('Failed to fetch order ids:', listResp);
			notifications.error('Failed to fetch orders: ' + listResp.message);
			throw listResp;
		}

		const ids = listResp.orders.map((o: any) => o.id);
		// Chunk ids into <=50 slices
		const chunks: number[][] = [];
		for (let i = 0; i < ids.length; i += 50) chunks.push(ids.slice(i, i + 50));

		// Fetch details for each chunk in parallel
        const detailsResponses = await Promise.all(chunks.map((chunk) => fetchOrderDetailsChunk(chunk)));

        // Fail loud if any chunk failed — partial data is dangerous for aggregation
        const failed = detailsResponses.find((r) => r instanceof Error);
        if (failed) {
            console.error('Failed to fetch one or more order detail chunks', failed);
            notifications.error('Failed to fetch all order details');
            throw failed;
        }

        // Collect successful results
        const details: DetailedOrder[] = [];
        for (const r of detailsResponses as { orders: any[] }[]) {
            details.push(...r.orders);
        }

		// Frontend is responsible for refund-filtering after collecting all details.
		// Apply same filtering logic as backend.fetchValidOrderDetails
		const refunded = new Set<number>();
		for (const o of details) {
			if (o.creditNoteDetails?.creditNoteOrderIds?.length > 0) refunded.add(o.id);
		}

		const validDetails = details.filter(
			(o) => o.orderType !== 'REFUND' && o.orderType !== 'POS' && !refunded.has(o.id)
		);

		// Now we need to aggregate into SimplifiedOrder shape as backend used to do.
		// Reuse the same logic as buildSimplifiedOrderFromDetailed/buildSimplifiedOrderFromProducts
		// For simplicity in this request, call the backend "updateDay" endpoint which returns simplified orders
		// However to keep things pure frontend-side, we will map details into simplified orders minimally.

        // Minimal client-side mapping: group by date+kitchen and sum quantities.
        // Use price from detailed order lines when available using same format logic as backend.
        const combined: Record<string, SimplifiedOrder & { cancelEnabledArr: boolean[] }> = {} as any;
        for (const order of validDetails) {
            const delivery = order.deliveries?.[0];
            const date = delivery?.deliveryTime?.slice(0, 10) || 'unknown';
            const kitchenId = order.kitchen?.id || NaN;
            const cancelEnabled = order.deliveries.every(
                (d: any) => !d.cancelOrder || d.cancelOrder.cancelEnable !== false
            );
            const key = `${date}-${kitchenId}`;
            if (!combined[key]) {
                combined[key] = { date, kitchenId, orderlines: [], cancelEnabled: false, cancelEnabledArr: [] } as any;
            }
            combined[key].cancelEnabledArr.push(cancelEnabled);
            for (const d of order.deliveries || []) {
                for (const line of d.orderLines || []) {
                    const exist = combined[key].orderlines.find((ol) => ol.productId === line.productId);
                    if (exist) exist.quantity += line.items;
                    else
                        combined[key].orderlines.push({ productId: line.productId, quantity: line.items, price: line.price ? (line.price.amount / Math.pow(10, line.price.scale)) : 0, name: line.name });
                }
            }
        }

		const simplified: SimplifiedOrder[] = Object.values(combined).map((c) => ({
			date: c.date,
			kitchenId: c.kitchenId,
			orderlines: c.orderlines,
			cancelEnabled: c.cancelEnabledArr.some((v) => v === true),
		}));

        // simplified is constructed locally — no runtime Error value expected here

		console.log('Fetched orders:', simplified);
		return simplified;

	}

	/**
	 * Update orders for a kitchen and day to match desired state
	 */
	static async updateDay(req: UpdateDayRequest): Promise<SimplifiedOrder[]> {
		const response = await apiClient.updateDay(req);

		if (response instanceof Error) {
			console.error('Failed to update day orders:', response);
			notifications.error('Failed to update day orders: ' + response.message);
			throw response;
		}

		console.log('Updated orders:', response.orders);
		return response.orders;
	}
}

// Create a singleton instance
export const ordersService = OrdersService;
