import { describe, it, expect } from 'vitest';
import {
	calculateSpentAmount,
	calculateRefundedAmount,
	formatDKK,
	calculateDeltaAmounts,
} from './orderAmountCalculator';
import type { SimplifiedOrder } from '../models/SimplifiedOrder';

describe('orderAmountCalculator', () => {
	const createOrder = (orderlines: { productId: number; price: number; quantity: number }[]): SimplifiedOrder =>
		({
			orderlines: orderlines.map((l) => ({
				productId: l.productId,
				price: l.price,
				quantity: l.quantity,
				name: 'Test Product',
			})),
		}) as SimplifiedOrder;

	describe('calculateSpentAmount', () => {
		it('returns 0 for undefined input', () => {
			expect(calculateSpentAmount(undefined)).toBe(0);
		});

		it('returns 0 for empty array', () => {
			expect(calculateSpentAmount([])).toBe(0);
		});

		it('sums positive line totals', () => {
			const orders = [
				createOrder([
					{ productId: 1, price: 10, quantity: 2 }, // 20
					{ productId: 2, price: 5, quantity: 3 }, // 15
				]),
			];
			expect(calculateSpentAmount(orders)).toBe(35);
		});

		it('ignores negative line totals', () => {
			const orders = [
				createOrder([
					{ productId: 1, price: 10, quantity: 2 }, // 20
					{ productId: 2, price: -5, quantity: 1 }, // -5 (refund)
				]),
			];
			expect(calculateSpentAmount(orders)).toBe(20);
		});

		it('aggregates across multiple orders', () => {
			const orders = [
				createOrder([{ productId: 1, price: 10, quantity: 1 }]), // 10
				createOrder([{ productId: 2, price: 15, quantity: 2 }]), // 30
			];
			expect(calculateSpentAmount(orders)).toBe(40);
		});
	});

	describe('calculateRefundedAmount', () => {
		it('returns 0 for undefined input', () => {
			expect(calculateRefundedAmount(undefined)).toBe(0);
		});

		it('returns 0 for empty array', () => {
			expect(calculateRefundedAmount([])).toBe(0);
		});

		it('sums absolute value of negative line totals', () => {
			const orders = [
				createOrder([
					{ productId: 1, price: -10, quantity: 1 }, // -10
					{ productId: 2, price: -5, quantity: 2 }, // -10
				]),
			];
			expect(calculateRefundedAmount(orders)).toBe(20);
		});

		it('ignores positive line totals', () => {
			const orders = [
				createOrder([
					{ productId: 1, price: 10, quantity: 1 }, // 10 (ignored)
					{ productId: 2, price: -5, quantity: 2 }, // -10
				]),
			];
			expect(calculateRefundedAmount(orders)).toBe(10);
		});
	});

	describe('formatDKK', () => {
		it('formats amount with DKK prefix and 2 decimal places', () => {
			expect(formatDKK(100)).toBe('DKK 100.00');
			expect(formatDKK(99.5)).toBe('DKK 99.50');
			expect(formatDKK(0)).toBe('DKK 0.00');
			expect(formatDKK(1234.567)).toBe('DKK 1234.57');
		});
	});

	describe('calculateDeltaAmounts', () => {
		it('returns zero deltas when both inputs are undefined', () => {
			expect(calculateDeltaAmounts(undefined, undefined)).toEqual({ spent: 0, refunded: 0 });
		});

		it('calculates spent when adding new items', () => {
			const next = createOrder([{ productId: 1, price: 10, quantity: 2 }]);
			const result = calculateDeltaAmounts(undefined, next);
			expect(result.spent).toBe(20);
			expect(result.refunded).toBe(0);
		});

		it('calculates refunded when removing items', () => {
			const prev = createOrder([{ productId: 1, price: 10, quantity: 2 }]);
			const result = calculateDeltaAmounts(prev, undefined);
			expect(result.spent).toBe(0);
			expect(result.refunded).toBe(20);
		});

		it('calculates spent and refunded when modifying quantities', () => {
			const prev = createOrder([
				{ productId: 1, price: 10, quantity: 3 }, // 30
				{ productId: 2, price: 5, quantity: 4 }, // 20
			]);
			const next = createOrder([
				{ productId: 1, price: 10, quantity: 1 }, // 10 (reduced by 20)
				{ productId: 2, price: 5, quantity: 6 }, // 30 (increased by 10)
			]);
			const result = calculateDeltaAmounts(prev, next);
			expect(result.spent).toBe(10); // product 2 increased
			expect(result.refunded).toBe(20); // product 1 decreased
		});

		it('handles new products being added', () => {
			const prev = createOrder([{ productId: 1, price: 10, quantity: 1 }]);
			const next = createOrder([
				{ productId: 1, price: 10, quantity: 1 },
				{ productId: 2, price: 15, quantity: 2 }, // new
			]);
			const result = calculateDeltaAmounts(prev, next);
			expect(result.spent).toBe(30);
			expect(result.refunded).toBe(0);
		});

		it('handles products being completely removed', () => {
			const prev = createOrder([
				{ productId: 1, price: 10, quantity: 1 },
				{ productId: 2, price: 15, quantity: 2 },
			]);
			const next = createOrder([{ productId: 1, price: 10, quantity: 1 }]);
			const result = calculateDeltaAmounts(prev, next);
			expect(result.spent).toBe(0);
			expect(result.refunded).toBe(30);
		});
	});
});
