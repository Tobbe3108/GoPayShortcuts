import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Login } from './login';

// Import the module that provides createGoPayClient so we can spy on it
import * as typesMod from '../../types';

const makeContext = () => {
  return {
    req: { header: vi.fn(() => undefined) },
    res: { headers: { set: vi.fn() } },
    env: {},
  } as any;
};

describe('Login route', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('happy path: returns token when credentials are valid', async () => {
    const loginResult = { authentication: { token: 'tok-123' } };

    // stub createGoPayClient to return client with login()
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      login: async (otp: string) => loginResult,
    }) as any);

    // stub validation to return body with otp
    vi.spyOn(Login.prototype as any, 'getValidatedData').mockResolvedValue({ body: { otp: '1234' } });

    const route = new Login();
    const c = makeContext();
    const res = await route.handle(c);

    expect(res).toHaveProperty('token', 'tok-123');
    expect(c.res.headers.set).toHaveBeenCalledWith('Cache-Control', 'no-store');
  });

  it('invalid credentials: returns Response (401) when client returns a Response', async () => {
    const resp = new Response(null, { status: 401, statusText: 'Unauthorized' });

    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      login: async (otp: string) => resp,
    }) as any);

    vi.spyOn(Login.prototype as any, 'getValidatedData').mockResolvedValue({ body: { otp: 'bad' } });

    const route = new Login();
    const c = makeContext();
    const result = await route.handle(c);

    // Should return the Response instance directly
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  it('validation errors: validation failure propagates (validation layer should return 400 in integration)', async () => {
    const err = new Error('Validation failed: otp is required');
    vi.spyOn(Login.prototype as any, 'getValidatedData').mockRejectedValue(err);

    const route = new Login();
    const c = makeContext();

    await expect(route.handle(c)).rejects.toThrow('Validation failed');
  });

  it('external failure: client.login throws -> error propagates (framework turns this into 500 in integration)', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      login: async () => {
        throw new Error('DB unavailable');
      },
    }) as any);

    vi.spyOn(Login.prototype as any, 'getValidatedData').mockResolvedValue({ body: { otp: '1234' } });

    const route = new Login();
    const c = makeContext();

    await expect(route.handle(c)).rejects.toThrow('DB unavailable');
  });
});
