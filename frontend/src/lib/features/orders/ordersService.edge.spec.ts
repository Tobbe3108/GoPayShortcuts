import { describe, it, expect, beforeEach, vi } from 'vitest';

import { OrdersService } from './ordersService';

const mockFetchIds = vi.fn();
const mockFetchChunk = vi.fn();
vi.mock('$lib/core/api/ordersClient', () => ({
  fetchOrderIdsForPeriod: (...args: any[]) => mockFetchIds(...args),
  fetchOrderDetailsChunk: (...args: any[]) => mockFetchChunk(...args),
}));

const mockNotifyError = vi.fn();
vi.mock('$lib/core/notifications/notificationStore', () => ({
  notifications: { error: (...args: any[]) => mockNotifyError(...args) },
}));

const mockUpdateDay = vi.fn();
vi.mock('$lib/core/api/apiClient', () => ({ apiClient: { updateDay: (...args: any[]) => mockUpdateDay(...args) } }));

describe('OrdersService edge cases', () => {
  beforeEach(() => {
    mockFetchIds.mockReset();
    mockFetchChunk.mockReset();
    mockNotifyError.mockReset();
  });

  it('chunks large id sets into multiple fetch calls', async () => {
    // create 120 ids
    const ids = Array.from({ length: 120 }, (_, i) => ({ id: i + 1 }));
    mockFetchIds.mockResolvedValue({ orders: ids });

    // each chunk returns an empty orders array
    mockFetchChunk.mockResolvedValue({ orders: [] });

    const res = await OrdersService.listOrders(new Date('2026-03-01'), new Date('2026-03-31'));
    // no orders present
    expect(res).toEqual([]);
    // should have been called 3 times: 50,50,20
    expect(mockFetchChunk).toHaveBeenCalledTimes(3);
  });

  it('aggregates orderlines across multiple deliveries and sums quantities', async () => {
    mockFetchIds.mockResolvedValue({ orders: [{ id: 201 }] });

    const orders = [
      {
        id: 201,
        orderType: 'NORMAL',
        deliveries: [
          { deliveryTime: '2026-03-12T08:00:00Z', orderLines: [{ productId: 7, items: 1 }] },
          { deliveryTime: '2026-03-12T09:00:00Z', orderLines: [{ productId: 7, items: 3 }] },
        ],
        kitchen: { id: 2 },
      },
    ];

    mockFetchChunk.mockResolvedValue({ orders });

    const result = await OrdersService.listOrders(new Date('2026-03-12'), new Date('2026-03-12'));
    expect(result).toHaveLength(1);
    const so = result[0];
    expect(so.orderlines).toHaveLength(1);
    expect(so.orderlines[0].productId).toBe(7);
    expect(so.orderlines[0].quantity).toBe(4);
  });

  it('computes cancelEnabled across orders: true if any order is cancel-enabled', async () => {
    mockFetchIds.mockResolvedValue({ orders: [{ id: 301 }, { id: 302 }] });

    const orders = [
      {
        id: 301,
        orderType: 'NORMAL',
        deliveries: [
          { deliveryTime: '2026-03-13T08:00:00Z', orderLines: [], cancelOrder: { cancelEnable: false } },
        ],
        kitchen: { id: 9 },
      },
      {
        id: 302,
        orderType: 'NORMAL',
        deliveries: [
          { deliveryTime: '2026-03-13T08:00:00Z', orderLines: [], cancelOrder: null },
        ],
        kitchen: { id: 9 },
      },
    ];

    mockFetchChunk.mockResolvedValue({ orders });

    const result = await OrdersService.listOrders(new Date('2026-03-13'), new Date('2026-03-13'));
    expect(result).toHaveLength(1);
    const so = result[0];
    // first order had cancelEnable false, second had null -> computed cancelEnabled per-order: false, true -> overall some true => true
    expect(so.cancelEnabled).toBe(true);
  });
});
