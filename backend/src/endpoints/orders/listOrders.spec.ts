import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ListOrders } from './listOrders';
import * as typesMod from '../../types';

const makeContext = () => ({
  req: { header: vi.fn(() => undefined) },
  res: { headers: { set: vi.fn() } },
} as any);

describe('ListOrders route', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('returns details for provided order ids (happy path)', async () => {
    const orders = [
      { id: 1, date: '2023-01-01' },
      { id: 2, date: '2023-01-02' },
    ];

    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      getOrderDetails: async (id: number) => orders.find((o) => o.id === id),
    }) as any);

    vi.spyOn(ListOrders.prototype as any, 'getValidatedData').mockResolvedValue({ body: { orderIds: [2, 1] } });

    const route = new ListOrders();
    const c = makeContext();
    const result = await route.handle(c);

    expect(result).toHaveProperty('orders');
    expect(Array.isArray(result.orders)).toBe(true);
    // sorted by date ascending
    expect(result.orders.map((o: any) => o.id)).toEqual([1, 2]);
    expect(c.res.headers.set).toHaveBeenCalled();
  });

  it('handles missing orders gracefully (getOrderDetails returns Response for missing)', async () => {
    const resp = new Response(null, { status: 404 });

    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      getOrderDetails: async (id: number) => (id === 1 ? { id: 1 } : resp),
    }) as any);

    vi.spyOn(ListOrders.prototype as any, 'getValidatedData').mockResolvedValue({ body: { orderIds: [1, 2] } });

    const route = new ListOrders();
    const c = makeContext();
    const result = await route.handle(c);

    expect(result.orders.length).toBe(1);
    expect(result.orders[0].id).toBe(1);
  });

  it('propagates client errors (throws) -> integration handles as 500', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      getOrderDetails: async () => {
        throw new Error('DB down');
      },
    }) as any);

    vi.spyOn(ListOrders.prototype as any, 'getValidatedData').mockResolvedValue({ body: { orderIds: [1] } });

    const route = new ListOrders();
    const c = makeContext();

    await expect(route.handle(c)).rejects.toThrow('DB down');
  });
});
