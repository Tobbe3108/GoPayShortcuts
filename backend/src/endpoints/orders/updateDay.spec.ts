import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PatchOrdersState } from './updateDay';
import * as typesMod from '../../types';
import * as ordersUtils from './shared/ordersUtils';

const makeContext = () => ({
  req: { header: vi.fn(() => undefined) },
  res: { headers: { set: vi.fn() } },
} as any);

describe('PatchOrdersState route', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('rejects past dates', async () => {
    // Ensure createGoPayClient does not access real env during the test
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async () => ({ orders: [] }),
    }) as any);

    vi.spyOn(PatchOrdersState.prototype as any, 'getValidatedData').mockResolvedValue({
      body: { kitchenId: 1, date: '2000-01-01', desiredOrders: [] },
    });

    const route = new PatchOrdersState();
    const c = makeContext();

    await expect(route.handle(c)).rejects.toMatchObject({ statusCode: 400 });
  });

  it('no-op when nothing to change -> returns empty list', async () => {
    // Simulate listOrders returning no orders for the date
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async () => ({ orders: [] }),
    }) as any);

    vi.spyOn(PatchOrdersState.prototype as any, 'getValidatedData').mockResolvedValue({
      body: { kitchenId: 1, date: new Date().toISOString().slice(0, 10), desiredOrders: [] },
    });

    const route = new PatchOrdersState();
    const c = makeContext();
    const result = await route.handle(c);

    expect(result).toHaveProperty('orders');
    expect(Array.isArray(result.orders)).toBe(true);
  });

  it('propagates client errors from listOrders', async () => {
    const resp = new Response(null, { status: 500 });
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async () => resp,
    }) as any);

    vi.spyOn(PatchOrdersState.prototype as any, 'getValidatedData').mockResolvedValue({
      body: { kitchenId: 1, date: new Date().toISOString().slice(0, 10), desiredOrders: [] },
    });

    const route = new PatchOrdersState();
    const c = makeContext();
    const result = await route.handle(c);

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(500);
  });

  it('keeps minimal set, cancels surplus and returns combined order', async () => {
    // Setup: two cancelable orders (one will be kept, one canceled) and no fixed orders
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async () => ({ orders: [{ id: 1 }, { id: 2 }] }),
    }) as any);

    const today = new Date().toISOString().slice(0, 10);

    // Detailed orders: both belong to kitchen 1, both cancelable, but one has product 10 x2, other product 10 x1
    const detailedKeep = {
      id: 1,
      kitchen: { id: 1 },
      deliveries: [
        { orderLines: [{ productId: 10, items: 2, price: { amount: 100, scale: 2 }, name: 'P' }], cancelOrder: { cancelEnable: true } },
      ],
      orderType: 'NORMAL',
    };
    const detailedCancel = {
      id: 2,
      kitchen: { id: 1 },
      deliveries: [
        { orderLines: [{ productId: 10, items: 1, price: { amount: 100, scale: 2 }, name: 'P' }], cancelOrder: { cancelEnable: true } },
      ],
      orderType: 'NORMAL',
    };

    vi.spyOn(ordersUtils, 'fetchValidOrderDetails' as any).mockResolvedValue([
      detailedKeep,
      detailedCancel,
    ] as any);

    // cancelOrdersBatch should be called and succeed
    const cancelSpy = vi.spyOn(ordersUtils, 'cancelOrdersBatch' as any).mockResolvedValue(null as any);

    // buildSimplifiedOrderFromDetailed is used to compose results; return simple simplified objects
    vi.spyOn(ordersUtils, 'buildSimplifiedOrderFromDetailed' as any).mockImplementation((date: any, kitchenId: any, order: any, cancelEnabled: any) => ({
      date,
      kitchenId,
      orderlines: order.deliveries.flatMap((d: any) => d.orderLines.map((l: any) => ({ productId: l.productId, quantity: l.items, price: 1 }))),
      cancelEnabled,
    }));

    vi.spyOn(PatchOrdersState.prototype as any, 'getValidatedData').mockResolvedValue({
      body: { kitchenId: 1, date: today, desiredOrders: [{ productId: 10, quantity: 2 }] },
    });

    const route = new PatchOrdersState();
    const c = makeContext();

    const result = await route.handle(c);

    // Expect cancelOrdersBatch to have been called (the surplus order should be canceled)
    expect(cancelSpy).toHaveBeenCalled();
    expect(result).toHaveProperty('orders');
    expect(result.orders[0].orderlines.find((l: any) => l.productId === 10).quantity).toBe(2);
  });

  it('creates new order when needed and includes created order in result', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async () => ({ orders: [{ id: 3 }] }),
    }) as any);

    const today = new Date().toISOString().slice(0, 10);

    // One cancelable order with product 20 x1
    const detailed = {
      id: 3,
      kitchen: { id: 2 },
      deliveries: [
        { orderLines: [{ productId: 20, items: 1, price: { amount: 100, scale: 2 }, name: 'Q' }], cancelOrder: { cancelEnable: true } },
      ],
      orderType: 'NORMAL',
    };

    vi.spyOn(ordersUtils, 'fetchValidOrderDetails' as any).mockResolvedValue([detailed] as any);

    // cancelOrdersBatch succeeds
    vi.spyOn(ordersUtils, 'cancelOrdersBatch' as any).mockResolvedValue(null as any);

    // createAndPayOrder will return created products
    vi.spyOn(ordersUtils, 'createAndPayOrder' as any).mockResolvedValue([{ productId: 30, quantity: 2 }] as any);

    // buildSimplifiedOrderFromDetailed for the existing order
    vi.spyOn(ordersUtils, 'buildSimplifiedOrderFromDetailed' as any).mockImplementation((date: any, kitchenId: any, order: any, cancelEnabled: any) => ({
      date,
      kitchenId,
      orderlines: order.deliveries.flatMap((d: any) => d.orderLines.map((l: any) => ({ productId: l.productId, quantity: l.items, price: 1 }))),
      cancelEnabled,
    }));

    // buildSimplifiedOrderFromProducts will be used to turn created products into simplified order
    vi.spyOn(ordersUtils, 'buildSimplifiedOrderFromProducts' as any).mockResolvedValue({
      date: today,
      kitchenId: 2,
      orderlines: [{ productId: 30, quantity: 2, price: 5 }],
      cancelEnabled: true,
    } as any);

    vi.spyOn(PatchOrdersState.prototype as any, 'getValidatedData').mockResolvedValue({
      body: { kitchenId: 2, date: today, desiredOrders: [{ productId: 20, quantity: 1 }, { productId: 30, quantity: 2 }] },
    });

    const route = new PatchOrdersState();
    const c = makeContext();

    const result = await route.handle(c);

    expect(result).toHaveProperty('orders');
    // Expect both existing product 20 and created product 30 to appear
    const products = result.orders[0].orderlines.map((l: any) => l.productId).sort();
    expect(products).toEqual([20, 30]);
  });

  it('retains fixed (non-cancelable) quantities even if they exceed desired', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async () => ({ orders: [{ id: 10 }] }),
    }) as any);

    const today = new Date().toISOString().slice(0, 10);

    const fixedDetailed = {
      id: 10,
      kitchen: { id: 3 },
      deliveries: [
        { orderLines: [{ productId: 50, items: 5, price: { amount: 100, scale: 2 }, name: 'Fixed' }], cancelOrder: { cancelEnable: false } },
      ],
      orderType: 'NORMAL',
    };

    vi.spyOn(ordersUtils, 'fetchValidOrderDetails' as any).mockResolvedValue([fixedDetailed] as any);
    vi.spyOn(ordersUtils, 'cancelOrdersBatch' as any).mockResolvedValue(null as any);
    vi.spyOn(ordersUtils, 'buildSimplifiedOrderFromDetailed' as any).mockImplementation((date: any, kitchenId: any, order: any, cancelEnabled: any) => ({
      date,
      kitchenId,
      orderlines: order.deliveries.flatMap((d: any) => d.orderLines.map((l: any) => ({ productId: l.productId, quantity: l.items, price: 1 }))),
      cancelEnabled,
    }));

    vi.spyOn(PatchOrdersState.prototype as any, 'getValidatedData').mockResolvedValue({
      body: { kitchenId: 3, date: today, desiredOrders: [{ productId: 50, quantity: 2 }] },
    });

    const route = new PatchOrdersState();
    const c = makeContext();

    const result = await route.handle(c);

    expect(result).toHaveProperty('orders');
    expect(result.orders[0].orderlines.find((l: any) => l.productId === 50).quantity).toBe(5);
  });

  it('propagates cancelOrdersBatch errors', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async () => ({ orders: [{ id: 20 }] }),
    }) as any);

    const today = new Date().toISOString().slice(0, 10);

    const detailed = {
      id: 20,
      kitchen: { id: 4 },
      deliveries: [
        { orderLines: [{ productId: 70, items: 1, price: { amount: 100, scale: 2 }, name: 'C' }], cancelOrder: { cancelEnable: true } },
      ],
      orderType: 'NORMAL',
    };

    vi.spyOn(ordersUtils, 'fetchValidOrderDetails' as any).mockResolvedValue([detailed] as any);
    vi.spyOn(ordersUtils, 'cancelOrdersBatch' as any).mockResolvedValue(new Response(JSON.stringify({ errors: ['x'] }), { status: 400 }) as any);

    vi.spyOn(PatchOrdersState.prototype as any, 'getValidatedData').mockResolvedValue({
      body: { kitchenId: 4, date: today, desiredOrders: [] },
    });

    const route = new PatchOrdersState();
    const c = makeContext();

    const result = await route.handle(c);

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(400);
  });

  it('returns empty orders when all cancelable orders are removed and nothing to create', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      listOrders: async () => ({ orders: [{ id: 30 }] }),
    }) as any);

    const today = new Date().toISOString().slice(0, 10);

    const detailed = {
      id: 30,
      kitchen: { id: 5 },
      deliveries: [
        { orderLines: [{ productId: 60, items: 1, price: { amount: 100, scale: 2 }, name: 'D' }], cancelOrder: { cancelEnable: true } },
      ],
      orderType: 'NORMAL',
    };

    vi.spyOn(ordersUtils, 'fetchValidOrderDetails' as any).mockResolvedValue([detailed] as any);
    vi.spyOn(ordersUtils, 'cancelOrdersBatch' as any).mockResolvedValue(null as any);

    vi.spyOn(PatchOrdersState.prototype as any, 'getValidatedData').mockResolvedValue({
      body: { kitchenId: 5, date: today, desiredOrders: [] },
    });

    const route = new PatchOrdersState();
    const c = makeContext();

    const result = await route.handle(c);

    expect(result).toHaveProperty('orders');
    expect(Array.isArray(result.orders)).toBe(true);
    expect(result.orders.length).toBe(0);
  });
});
