import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RequestOTP } from './requestOTP';
import * as typesMod from '../../types';

const makeContext = () => {
  return {
    req: { header: vi.fn(() => undefined) },
    res: { headers: { set: vi.fn() } },
    env: {},
  } as any;
};

describe('RequestOTP route', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('happy path: returns 204 when OTP requested', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      requestOTP: async (email: string) => ({ status: 'ok', email }),
    }) as any);

    vi.spyOn(RequestOTP.prototype as any, 'getValidatedData').mockResolvedValue({ body: { email: 'user@example.com' } });

    const route = new RequestOTP();
    const c = makeContext();

    const res = await route.handle(c);

    expect(res).toBeInstanceOf(Response);
    expect((res as Response).status).toBe(204);
    expect((res as Response).headers.get('Cache-Control')).toBe('no-store');
  });

  it('propagates Response from client (error)', async () => {
    const resp = new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      requestOTP: async () => resp,
    }) as any);

    vi.spyOn(RequestOTP.prototype as any, 'getValidatedData').mockResolvedValue({ body: { email: 'missing@example.com' } });

    const route = new RequestOTP();
    const c = makeContext();

    const result = await route.handle(c);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(404);
  });

  it('validation errors propagate', async () => {
    const err = new Error('Validation failed');
    vi.spyOn(RequestOTP.prototype as any, 'getValidatedData').mockRejectedValue(err);

    const route = new RequestOTP();
    const c = makeContext();

    await expect(route.handle(c)).rejects.toThrow('Validation failed');
  });
});
