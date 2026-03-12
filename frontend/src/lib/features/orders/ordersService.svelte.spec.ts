import { describe, it, expect, beforeEach, vi } from 'vitest';

// Under test
import { OrdersService } from './ordersService';

// Mocks for external modules the service depends on
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

describe('OrdersService', () => {
  beforeEach(() => {
    mockFetchIds.mockReset();
    mockFetchChunk.mockReset();
    mockNotifyError.mockReset();
    mockUpdateDay.mockReset();
  });

  it('throws when fetchOrderIdsForPeriod returns an Error', async () => {
    mockFetchIds.mockResolvedValue(new Error('network'));

    await expect(OrdersService.listOrders(new Date(), new Date())).rejects.toBeInstanceOf(Error);
    expect(mockNotifyError).toHaveBeenCalled();
  });

  it('throws when any details chunk returns an Error', async () => {
    // return two ids → one chunk
    mockFetchIds.mockResolvedValue({ orders: [{ id: 1 }, { id: 2 }] });
    mockFetchChunk.mockResolvedValue(new Error('chunk-failed'));

    await expect(OrdersService.listOrders(new Date(), new Date())).rejects.toBeInstanceOf(Error);
    expect(mockNotifyError).toHaveBeenCalled();
  });

  it('filters refunds/credit-notes and aggregates order lines', async () => {
    // two ids that will be combined into one chunk
    mockFetchIds.mockResolvedValue({ orders: [{ id: 10 }, { id: 11 }, { id: 12 }] });

    const orders = [
      // valid order with one delivery and one line
      {
        id: 10,
        orderType: 'NORMAL',
        deliveries: [
          {
            deliveryTime: '2026-03-12T10:00:00Z',
            orderLines: [{ productId: 1, items: 2, price: { amount: 500, scale: 2 }, name: 'A' }],
          },
        ],
        kitchen: { id: 5 },
      },
      // REFUND type → should be filtered out
      {
        id: 11,
        orderType: 'REFUND',
        deliveries: [
          {
            deliveryTime: '2026-03-12T10:00:00Z',
            orderLines: [{ productId: 1, items: 100 }],
          },
        ],
        kitchen: { id: 5 },
      },
      // credit note referencing order 10 → should mark 12 as refunded (filtered)
      {
        id: 12,
        orderType: 'NORMAL',
        creditNoteDetails: { creditNoteOrderIds: [10] },
        deliveries: [
          {
            deliveryTime: '2026-03-12T10:00:00Z',
            orderLines: [{ productId: 2, items: 1, price: { amount: 200, scale: 2 }, name: 'B' }],
          },
        ],
        kitchen: { id: 5 },
      },
    ];

    mockFetchChunk.mockResolvedValue({ orders });

    const result = await OrdersService.listOrders(new Date('2026-03-12'), new Date('2026-03-12'));

    // Only order 10 should survive (11 is REFUND, 12 is credit-note referencing 10)
    expect(result).toHaveLength(1);
    const so = result[0];
    expect(so.kitchenId).toBe(5);
    expect(so.date).toBe('2026-03-12');
    expect(so.orderlines).toHaveLength(1);
    expect(so.orderlines[0].productId).toBe(1);
    expect(so.orderlines[0].quantity).toBe(2);
    // price computed from amount/10^scale → 500/100 = 5
    expect(so.orderlines[0].price).toBeCloseTo(5);
  });

  it('updateDay returns orders when apiClient returns data', async () => {
    const fakeResp = { orders: [{ date: '2026-03-12', kitchenId: 1, orderlines: [], cancelEnabled: false }] };
    mockUpdateDay.mockResolvedValue(fakeResp);

    const out = await OrdersService.updateDay({ date: '2026-03-12', kitchenId: 1, orderlines: [] } as any);
    expect(out).toEqual(fakeResp.orders);
  });

  it('updateDay throws and notifies on Error', async () => {
    mockUpdateDay.mockResolvedValue(new Error('bad'));

    await expect(OrdersService.updateDay({} as any)).rejects.toBeInstanceOf(Error);
    expect(mockNotifyError).toHaveBeenCalled();
  });
});
