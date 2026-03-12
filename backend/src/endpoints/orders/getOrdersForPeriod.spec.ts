import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GetOrdersForPeriod } from './getOrdersForPeriod';
import * as typesMod from '../../types';

const makeContext = () => ({
  req: { header: vi.fn(() => undefined) },
  res: { headers: { set: vi.fn() } },
} as any);

describe('GetOrdersForPeriod route', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('returns orders and sets cache header (happy path)', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async (start: string, end: string) => ({ orders: [{ id: 1, start, end }] }),
    }) as any);

    vi.spyOn(GetOrdersForPeriod.prototype as any, 'getValidatedData').mockResolvedValue({ query: { start: '2024-01-01', end: '2024-01-02' } });

    const route = new GetOrdersForPeriod();
    const c = makeContext();
    const result = await route.handle(c);

    expect(result).toHaveProperty('orders');
    expect(Array.isArray(result.orders)).toBe(true);
    expect(result.orders[0].id).toBe(1);
    expect(c.res.headers.set).toHaveBeenCalled();
  });

  it('forwards Response returned by client.listOrders', async () => {
    const resp = new Response(null, { status: 401 });

    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async () => resp,
    }) as any);

    vi.spyOn(GetOrdersForPeriod.prototype as any, 'getValidatedData').mockResolvedValue({ query: { start: '2024-01-01', end: '2024-01-02' } });

    const route = new GetOrdersForPeriod();
    const c = makeContext();
    const result = await route.handle(c);

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(401);
  });
});
