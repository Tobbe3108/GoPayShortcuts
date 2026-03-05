import type { SimplifiedOrder } from '$lib/features/orders/models/SimplifiedOrder';

/** Sum positive line totals across orders */
export function calculateSpentAmount(orders: SimplifiedOrder[] | undefined): number {
    if (!orders) return 0;
    let total = 0;
    for (const o of orders) {
        for (const l of o.orderlines || []) {
            const v = l.price * l.quantity;
            if (v > 0) total += v;
        }
    }
    return total;
}

/** Sum absolute value of negative line totals across orders */
export function calculateRefundedAmount(orders: SimplifiedOrder[] | undefined): number {
    if (!orders) return 0;
    let total = 0;
    for (const o of orders) {
        for (const l of o.orderlines || []) {
            const v = l.price * l.quantity;
            if (v < 0) total += Math.abs(v);
        }
    }
    return total;
}

export function formatDKK(amount: number): string {
    return `DKK ${amount.toFixed(2)}`;
}

/**
 * Compute deltas between two SimplifiedOrder snapshots (prev -> next).
 * Returns positive numbers { spent, refunded } representing amounts the user
 * spent (added) and refunded (reduced) when moving from prev to next.
 */
export function calculateDeltaAmounts(prev?: SimplifiedOrder, next?: SimplifiedOrder): { spent: number; refunded: number } {
    const prevMap = new Map<number, number>();
    const nextMap = new Map<number, number>();

    if (prev?.orderlines) {
        for (const l of prev.orderlines) {
            prevMap.set(l.productId, (prevMap.get(l.productId) || 0) + l.price * l.quantity);
        }
    }
    if (next?.orderlines) {
        for (const l of next.orderlines) {
            nextMap.set(l.productId, (nextMap.get(l.productId) || 0) + l.price * l.quantity);
        }
    }

    const ids = new Set<number>([...prevMap.keys(), ...nextMap.keys()]);
    let spent = 0;
    let refunded = 0;
    for (const id of ids) {
        const p = prevMap.get(id) || 0;
        const n = nextMap.get(id) || 0;
        const delta = n - p;
        if (delta > 0) spent += delta;
        else if (delta < 0) refunded += Math.abs(delta);
    }
    return { spent, refunded };
}
