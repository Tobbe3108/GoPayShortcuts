import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildSimplifiedOrderFromDetailed,
  buildSimplifiedOrderFromProducts,
  fetchValidOrderDetails,
  getDeliveryLocation,
  createAndPayOrder,
  cancelOrdersBatch,
} from './ordersUtils';
import { GoPayClient } from '../../../goPay/client';

const makeDetailedOrder = (id: number) => ({
  id,
  orderType: 'LUNCH',
  deliveries: [
    {
      orderLines: [
        { productId: 1, items: 2, price: { amount: 200, scale: 2 }, name: 'A' },
      ],
    },
  ],
});

describe('ordersUtils', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('buildSimplifiedOrderFromDetailed aggregates lines and formats price', () => {
    const simplified = buildSimplifiedOrderFromDetailed('2023-01-01', 1, makeDetailedOrder(5) as any, true);
    expect(simplified.orderlines).toHaveLength(1);
    expect(simplified.orderlines[0].price).toBe(2);
  });

  it('buildSimplifiedOrderFromProducts resolves names and prices via client', async () => {
    const client = { getProducts: vi.fn(async () => ({ menues: [{ productGroups: [{ name: 'Kantinemad', products: [{ id: 10, name: 'A', price: { amount: 100, scale: 2 } }] }], kitchen: { id: 1 } }] })) } as any as GoPayClient;

    const result = await buildSimplifiedOrderFromProducts(client, '2023-01-01', 1, [{ productId: 10, quantity: 2, name: 'A' }], false);
    expect(result.orderlines[0].productId).toBe(10);
    expect(result.orderlines[0].price).toBe(1);

    // when product id is unknown but name matches, it should resolve via name
    const resultByName = await buildSimplifiedOrderFromProducts(client, '2023-01-01', 1, [{ productId: 999, quantity: 1, name: 'A' }], false);
    expect(resultByName.orderlines[0].productId).toBe(10);
    expect(resultByName.orderlines[0].price).toBe(1);
  });

  it('fetchValidOrderDetails filters out refund type and missing details', async () => {
    const client = { getOrderDetails: vi.fn(async (id: number) => (id === 1 ? makeDetailedOrder(1) : { orderType: 'REFUND', id })) } as any as GoPayClient;
    const details = await fetchValidOrderDetails([{ id: 1 }, { id: 2 } as any], client);
    expect(details.some((d) => d.orderType === 'REFUND')).toBe(false);

    // ensure that orders with creditNoteDetails are filtered out
    const detailWithCreditNote = makeDetailedOrder(3);
    // @ts-ignore
    detailWithCreditNote.creditNoteDetails = { creditNoteOrderIds: [3] };
    const client2 = { getOrderDetails: vi.fn(async (id: number) => (id === 3 ? detailWithCreditNote : makeDetailedOrder(id))) } as any as GoPayClient;
    const details2 = await fetchValidOrderDetails([{ id: 3 }, { id: 4 } as any], client2);
    expect(details2.some((d) => d.id === 3)).toBe(false);
  });

  it('getDeliveryLocation returns 404 when kitchen not found', async () => {
    const client = { getLocations: vi.fn(async () => [{ name: 'A', kitchens: [{ id: 9, webshops: [{ uid: 'w' }] }] }]) } as any as GoPayClient;
    const res = await getDeliveryLocation(client, 999);
    expect((res as any).status).toBe(404);
  });

  it('getDeliveryLocation returns location object when found', async () => {
    const client = { getLocations: vi.fn(async () => [{ name: 'Office', kitchens: [{ id: 5, webshops: [{ uid: 'web-uid' }] }] }]) } as any as GoPayClient;
    const res = await getDeliveryLocation(client, 5);
    expect((res as any).kitchenId).toBe(5);
    expect((res as any).webshopUid).toBe('web-uid');
  });

  it('buildSimplifiedOrderFromDetailed aggregates across deliveries and merges quantities for same productId', () => {
    const detailed: any = {
      id: 10,
      orderType: 'LUNCH',
      deliveries: [
        { orderLines: [{ productId: 1, items: 2, price: { amount: 200, scale: 2 }, name: 'A' }] },
        { orderLines: [{ productId: 1, items: 3, price: { amount: 200, scale: 2 }, name: 'A' }] },
      ],
    };

    const simplified = buildSimplifiedOrderFromDetailed('2023-01-01', 1, detailed, false);
    expect(simplified.orderlines).toHaveLength(1);
    expect(simplified.orderlines[0].quantity).toBe(5);
  });

  it('cancelOrdersBatch returns null when all deletes succeed and returns Response when some fail', async () => {
    // all succeed
    const clientSuccess = { deleteOrder: vi.fn(async (id: number) => ({ success: true })) } as any as GoPayClient;
    const res1 = await (cancelOrdersBatch as any)(clientSuccess, [{ id: 1 }, { id: 2 }]);
    expect(res1).toBeNull();

    // one fails returning a Response
    const failingResponse = new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
    const clientMixed = {
      deleteOrder: vi.fn(async (id: number) => (id === 2 ? failingResponse : { success: true })),
    } as any as GoPayClient;

    const res2 = await (cancelOrdersBatch as any)(clientMixed, [{ id: 1 }, { id: 2 }]);
    expect(res2 instanceof Response).toBe(true);
    if (res2 instanceof Response) {
      const body = await res2.json();
      expect(body.errors).toBeDefined();
      expect(res2.status).toBe(400);
    }
  });

  it('createAndPayOrder returns products when success', async () => {
    const client: any = {
      getLocations: vi.fn(async () => [{ name: 'A', kitchens: [{ id: 1, webshops: [{ uid: 'w' }] }] }]),
      placeOrder: vi.fn(async () => ({ salesConditionsUrl: 'u' })),
      payOrder: vi.fn(async () => ({ orderId: 123 })),
      getProducts: vi.fn(async () => ({ menues: [{ productGroups: [{ name: 'Kantinemad', products: [{ id: 1, name: 'X', price: { amount: 100, scale: 2 } }] }], kitchen: { id: 1 } }] })),
    } as GoPayClient;

    const out = await createAndPayOrder(client, 1, '2023-01-01', [{ productId: 1, quantity: 1 }]);
    expect(Array.isArray(out)).toBe(true);
  });

  it('buildSimplifiedOrderFromProducts falls back to provided id when catalog empty', async () => {
    const client = { getProducts: vi.fn(async () => ({ menues: [], kitchen: { id: 1 } })) } as any as GoPayClient;
    const result = await buildSimplifiedOrderFromProducts(client, '2023-01-01', 1, [{ productId: 999, quantity: 1 }], false);
    expect(result.orderlines[0].productId).toBe(999);
    expect(result.orderlines[0].price).toBe(0);
  });

  it('createAndPayOrder returns Response when placeOrder returns Response', async () => {
    const failing = new Response('place error', { status: 500 });
    const client: any = {
      getLocations: vi.fn(async () => [{ name: 'A', kitchens: [{ id: 1, webshops: [{ uid: 'w' }] }] }]),
      placeOrder: vi.fn(async () => failing),
      payOrder: vi.fn(async () => ({ orderId: 123 })),
      getProducts: vi.fn(async () => ({ menues: [], kitchen: { id: 1 } })),
    } as GoPayClient;

    const out = await createAndPayOrder(client, 1, '2023-01-01', [{ productId: 1, quantity: 1 }]);
    expect(out instanceof Response).toBe(true);
    if (out instanceof Response) expect(out.status).toBe(500);
  });

  it('createAndPayOrder returns Response when payOrder returns Response', async () => {
    const failing = new Response('pay error', { status: 402 });
    const client: any = {
      getLocations: vi.fn(async () => [{ name: 'A', kitchens: [{ id: 1, webshops: [{ uid: 'w' }] }] }]),
      placeOrder: vi.fn(async () => ({ salesConditionsUrl: 'u' })),
      payOrder: vi.fn(async () => failing),
      getProducts: vi.fn(async () => ({ menues: [], kitchen: { id: 1 } })),
    } as GoPayClient;

    const out = await createAndPayOrder(client, 1, '2023-01-01', [{ productId: 1, quantity: 1 }]);
    expect(out instanceof Response).toBe(true);
    if (out instanceof Response) expect(out.status).toBe(402);
  });

  it('getDeliveryLocation returns Response when client returns Response', async () => {
    const client = { getLocations: vi.fn(async () => new Response('err', { status: 500 })) } as any as GoPayClient;
    const res = await getDeliveryLocation(client, 1);
    expect(res instanceof Response).toBe(true);
  });

  it('fetchValidOrderDetails ignores orders where getOrderDetails returns Response', async () => {
    const client = { getOrderDetails: vi.fn(async (id: number) => (id === 1 ? makeDetailedOrder(1) : new Response('not found', { status: 404 }))) } as any as GoPayClient;
    const details = await fetchValidOrderDetails([{ id: 1 }, { id: 2 } as any], client);
    expect(details.map((d) => d.id)).toEqual([1]);
  });
});
