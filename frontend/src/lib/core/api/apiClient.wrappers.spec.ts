import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from './apiClient';

describe('ApiClient wrappers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requestOTP returns parsed JSON on success', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })) as any);
  // ensure we use the real ApiClient implementation even if other tests mock the module
  const Real = await vi.importActual('./apiClient');
  const c = new Real.ApiClient('http://api');
    const res = await c.requestOTP('u@e');
    expect(res).toEqual({ ok: true });
  });

  it('login returns Error on non-2xx', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 401, statusText: 'Unauth' })) as any);
    const c = new ApiClient('http://api');
    const res = await c.login('otp');
    expect(res).toBeInstanceOf(Error);
  });

  it('getLocations/getProducts/getMenu return parsed bodies', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => new Response(JSON.stringify({ url }), { status: 200, headers: { 'content-type': 'application/json' } })) as any);
    const c = new ApiClient('http://api');
    const loc = await c.getLocations();
    expect((loc as any).url).toContain('/locations');
    const prod = await c.getProducts(7);
    expect((prod as any).url).toContain('/products');
    const menu = await c.getMenu();
    expect((menu as any).url).toContain('/menu');
  });

  it('listRawOrdersForPeriod calls endpoint with formatted dates', async () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-02');
    let capturedUrl = '';
    vi.stubGlobal('fetch', vi.fn(async (url: string) => { capturedUrl = url; return new Response(JSON.stringify({ orders: [] }), { status: 200, headers: { 'content-type': 'application/json' } }); }) as any);
    const c = new ApiClient('http://api');
    const res = await c.listRawOrdersForPeriod(start, end);
    expect(capturedUrl).toContain('/orders/period?start=2023-01-01&end=2023-01-02');
    expect(res).toEqual({ orders: [] });
  });

  it('updateDay PATCHes and returns parsed orders', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ orders: [] }), { status: 200, headers: { 'content-type': 'application/json' } })) as any);
    const c = new ApiClient('http://api');
    const out = await c.updateDay({ kitchenId: 1, date: '2023-01-01', desiredOrders: [] } as any);
    expect((out as any).orders).toBeDefined();
  });

  it('adds Authorization header when token present', async () => {
    // Spy getAuthToken on prototype
    vi.spyOn((ApiClient.prototype as any), 'getAuthToken').mockReturnValue('jwt-token');
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init?: RequestInit) => {
      const headers = (init && (init as any).headers) || {};
      return new Response(JSON.stringify({ headers }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as any);

    const c = new ApiClient('http://api');
    const res: any = await c.request('/x');
    const sent = res.headers;
    if (sent.get) {
      expect(sent.get('Authorization') || sent.get('authorization')).toContain('Bearer jwt-token');
    } else {
      expect(sent['Authorization'] || sent['authorization']).toContain('Bearer jwt-token');
    }
  });
});
