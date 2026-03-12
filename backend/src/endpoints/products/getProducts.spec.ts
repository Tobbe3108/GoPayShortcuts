import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GetProducts } from './getProducts';
import * as typesMod from '../../types';

const makeContext = (queryReturn?: any) => ({
  req: { header: vi.fn(() => undefined), query: vi.fn(() => queryReturn) },
  res: { headers: { set: vi.fn() } },
  env: {},
  // c.text used in the route for invalid kitchenId
  text: (t: any, s: number) => ({ text: t, status: s }),
}) as any;

describe('GetProducts route', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('returns extracted products and sets cache header (happy path)', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      getLocations: async () => [
        { name: 'Canteen', kitchens: [{ id: 7, name: 'Main' }] },
      ],
      getProducts: async (kitchenId?: number) => ({
        menues: [
          {
            id: 1,
            name: 'Menu 1',
            productGroups: [
              {
                name: 'Kantinemad',
                products: [
                  { id: 10, name: 'Sandwich', price: { amount: 1000, scale: 2 } },
                ],
              },
            ],
          },
        ],
        kitchen: { id: 7, name: 'Main' },
      }),
    }) as any);

    const route = new GetProducts();
    const c = makeContext(undefined);
    const result = await route.handle(c);

    // extractProducts maps price via formatAmount: 1000 / 10^2 = 10
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toMatchObject({ id: 10, name: 'Sandwich', price: 10 });
    expect(c.res.headers.set).toHaveBeenCalled();
  });

  it('returns 400 when kitchenId query is not a number', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      getLocations: async () => [],
      getProducts: async () => ({}),
    }) as any);

    const route = new GetProducts();
    const c = makeContext('not-a-number');
    const result = await route.handle(c);

    expect(result).toHaveProperty('status', 400);
  });
});
