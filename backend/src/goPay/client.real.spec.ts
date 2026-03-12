import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GoPayClient } from './client';
import { format } from 'date-fns';

describe('GoPayClient (real)', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('requestOTP returns parsed JSON on 200', async () => {
    const payload = { status: 'ok' };
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(payload), { status: 200, headers: { 'content-type': 'application/json' } })) as any);

    const client = new GoPayClient('https://api', 't');
    const res = await client.requestOTP('a@b');
    expect(res).toEqual(payload);
  });

  it('requestOTP returns Response on non-2xx', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 404 })) as any);
    const client = new GoPayClient('https://api', 't');
    const res = await client.requestOTP('x@y');
    expect(res).toBeInstanceOf(Response);
    expect((res as Response).status).toBe(404);
  });

  it('getProducts calls endpoint with today date and returns parsed body', async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const kitchenId = 7;
    const expectedPath = `/suppliers/kitchens/${kitchenId}/menues/catering?date=${today}`;

    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      // Ensure the URL contains the expected path
      if (!url.includes(expectedPath)) {
        return new Response(null, { status: 500 });
      }
      return new Response(JSON.stringify({ menues: [], kitchen: { id: kitchenId, name: 'K' } }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as any);

    const client = new GoPayClient('https://api', 't');
    const res = await client.getProducts(kitchenId);
    expect(res).not.toBeInstanceOf(Response);
    expect((res as any).kitchen.id).toBe(kitchenId);
  });

  it('listOrders follows pagination and aggregates orders', async () => {
    const page1 = { orders: [{ id: 1 }], pagination: { nextLink: { href: 'https://example.com?offset=50' } } };
    const page2 = { orders: [{ id: 2 }], pagination: {} };

    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.includes('offset=0')) return new Response(JSON.stringify(page1), { status: 200, headers: { 'content-type': 'application/json' } });
      return new Response(JSON.stringify(page2), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as any);

    const client = new GoPayClient('https://api', 't');
    const res = await client.listOrders('2023-01-01', '2023-01-02');
    expect(Array.isArray(res.orders)).toBe(true);
    expect(res.orders.map((o: any) => o.id)).toEqual([1, 2]);
  });

  it('listOrders handles nextLink without offset by incrementing offset', async () => {
    const page1 = { orders: [{ id: 11 }], pagination: { nextLink: { href: 'https://example.com/next' } } };
    const page2 = { orders: [{ id: 12 }], pagination: {} };

    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.includes('offset=0')) return new Response(JSON.stringify(page1), { status: 200, headers: { 'content-type': 'application/json' } });
      return new Response(JSON.stringify(page2), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as any);

    const client = new GoPayClient('https://api', 't');
    const res = await client.listOrders('2023-01-01', '2023-01-02');
    expect(Array.isArray(res.orders)).toBe(true);
    expect(res.orders.map((o: any) => o.id)).toEqual([11, 12]);
  });

  it('login returns parsed JSON on success and Response on non-2xx', async () => {
    // success
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ user: { id: 5 } }), { status: 200, headers: { 'content-type': 'application/json' } })) as any);
    const client = new GoPayClient('https://api', 't');
    const login = await client.login('otp');
    expect((login as any).user.id).toBe(5);

    // non-2xx
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 401 })) as any);
    const client2 = new GoPayClient('https://api', 't');
    const res = await client2.login('otp');
    expect(res).toBeInstanceOf(Response);
    expect((res as Response).status).toBe(401);
  });

  it('getLocations returns array when ok', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([{ id: 1 }]), { status: 200, headers: { 'content-type': 'application/json' } })) as any);
    const client = new GoPayClient('https://api', 't');
    const res = await client.getLocations();
    expect(Array.isArray(res)).toBe(true);
  });

  it('placeOrder and payOrder return parsed bodies and getOrderDetails returns first order', async () => {
    // multiplex responses based on URL
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes('/payment/paymentDetails/catering')) {
        return new Response(JSON.stringify({ salesConditionsUrl: 'u' }), { status: 200, headers: { 'content-type': 'application/json' } });
      }
      if (url.endsWith('/orders/catering')) {
        return new Response(JSON.stringify({ orderId: 99, status: 'PAID' }), { status: 200, headers: { 'content-type': 'application/json' } });
      }
      if (url.includes('/orders/')) {
        return new Response(JSON.stringify({ orders: [{ id: 99 }] }), { status: 200, headers: { 'content-type': 'application/json' } });
      }
      return new Response(null, { status: 404 });
    }) as any);

    const client = new GoPayClient('https://api', 't');
    const place = await client.placeOrder(1, [] as any);
    expect((place as any).salesConditionsUrl).toBe('u');

    const pay = await client.payOrder(1, 'web', [] as any);
    expect((pay as any).orderId).toBe(99);

    const details = await client.getOrderDetails(99);
    expect((details as any).id).toBe(99);
  });

  it('deleteOrder returns Response on non-ok and parsed on ok', async () => {
    // non-ok
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 500 })) as any);
    const client = new GoPayClient('https://api', 't');
    const r = await client.deleteOrder(123);
    expect(r).toBeInstanceOf(Response);

    // ok
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'content-type': 'application/json' } })) as any);
    const client2 = new GoPayClient('https://api', 't');
    const r2 = await client2.deleteOrder(123);
    expect((r2 as any).success).toBe(true);
  });

  it('request throws ApiError when fetch throws', async () => {
    // Silence console.error in this test to avoid noisy stderr output
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network down'); }) as any);
    const client = new GoPayClient('https://api', 't');
    await expect(client.requestOTP('a@b')).rejects.toMatchObject({ statusCode: 500 });
    errSpy.mockRestore();
  });
});
