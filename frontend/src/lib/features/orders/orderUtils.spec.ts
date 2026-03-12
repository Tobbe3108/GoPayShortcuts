import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the ordersService before importing the module under test so the import picks up the mock
vi.mock('$lib/features/orders/ordersService', () => ({
  ordersService: { listOrders: vi.fn() },
}));

import * as orderUtils from './orderUtils';
import { ordersService } from '$lib/features/orders/ordersService';

describe('orderUtils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (ordersService.listOrders as any).mockReset?.();
  });

  it('toRecord groups orders by date', () => {
    const orders = [
      { date: '2023-03-05', kitchenId: 1, orderlines: [], cancelEnabled: false },
      { date: '2023-03-05', kitchenId: 2, orderlines: [], cancelEnabled: true },
      { date: '2023-03-06', kitchenId: 1, orderlines: [], cancelEnabled: false },
    ];

    const rec = orderUtils.toRecord(orders as any);

    expect(Object.keys(rec).sort()).toEqual(['2023-03-05', '2023-03-06']);
    expect(rec['2023-03-05']).toHaveLength(2);
    expect(rec['2023-03-06'][0].kitchenId).toBe(1);
  });

  it('ordersByDay returns orders for the given date', () => {
    const record = {
      '2023-03-05': [{ date: '2023-03-05', kitchenId: 1, orderlines: [], cancelEnabled: false, tempOrder: false }],
    } as any;

    const out = orderUtils.ordersByDay(record, new Date('2023-03-05T12:00:00Z'));
    expect(out).toHaveLength(1);
    expect(out[0].kitchenId).toBe(1);
  });

  it('templateOrderToSimplifiedOrder formats date and fields', () => {
    const templ = { locationId: 42, orderlines: [{ productId: 1, quantity: 2 }] } as any;
    const out = orderUtils.templateOrderToSimplifiedOrder(templ, new Date('2023-03-05T00:00:00Z'));
    expect(out.date).toBe('2023-03-05');
    expect(out.kitchenId).toBe(42);
    expect(out.tempOrder).toBe(true);
    expect(out.cancelEnabled).toBe(false);
  });

  it('updateOrderForKitchen replaces existing kitchen entries for the date', () => {
    const date = '2023-03-05';
    const record: Record<string, any[]> = {};
    record[date] = [
      { date, kitchenId: 1, tempOrder: false },
      { date, kitchenId: 2, tempOrder: false },
    ];

    orderUtils.updateOrderForKitchen(record, { date, kitchenId: 1, orderlines: [], cancelEnabled: false, tempOrder: false });

    expect(record[date].length).toBe(2);
    // ensure only one entry for kitchenId 1 exists and it's the new one (last pushed)
    const found = record[date].filter((o) => o.kitchenId === 1);
    expect(found).toHaveLength(1);
  });

  it('handleCancel removes orders for a kitchen on a date', () => {
    const date = '2023-03-05';
    const record: Record<string, any[]> = {};
    record[date] = [
      { date, kitchenId: 1 },
      { date, kitchenId: 2 },
    ];

    orderUtils.handleCancel(record, date, 1);
    expect(record[date]).toHaveLength(1);
    expect(record[date][0].kitchenId).toBe(2);
  });

  it('handleOrderChange applies new orders into the record', () => {
    const record: Record<string, any[]> = {};
    const newState = [
      { date: '2023-03-05', kitchenId: 1, orderlines: [], cancelEnabled: false },
      { date: '2023-03-06', kitchenId: 2, orderlines: [], cancelEnabled: true },
    ];

    orderUtils.handleOrderChange(record, newState as any);

    expect(Object.keys(record).sort()).toEqual(['2023-03-05', '2023-03-06']);
    expect(record['2023-03-05'][0].kitchenId).toBe(1);
    expect(record['2023-03-05'][0].tempOrder).toBe(false);
    expect(record['2023-03-06'][0].kitchenId).toBe(2);
  });

  it('listOrders calls ordersService.listOrders and returns a record', async () => {
    const fake = [{ date: '2023-03-05', kitchenId: 1, orderlines: [], cancelEnabled: false }];
    (ordersService.listOrders as any).mockResolvedValue(fake);

    const res = await orderUtils.listOrders(new Date('2023-03-01'), new Date('2023-03-07'));

    expect(ordersService.listOrders).toHaveBeenCalled();
    expect(res).toEqual(orderUtils.toRecord(fake as any));
  });
});
