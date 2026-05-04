import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GetLocations } from './getLocations';
import * as typesMod from '../../types';

const makeContext = () => ({
  req: { header: vi.fn(() => undefined) },
  res: { headers: { set: vi.fn() } },
} as any);

describe('GetLocations route', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('maps locations -> kitchenId/name and sets cache header', async () => {
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      getLocations: async () => [
        { name: 'Alpha', kitchens: [{ id: 11, name: 'A' }] },
        { name: 'Beta', kitchens: [{ id: 22, name: 'B' }] },
      ],
    }) as any);

    const route = new GetLocations();
    const c = makeContext();
    const res = await route.handle(c);

    expect(Array.isArray(res)).toBe(true);
    expect(res[0]).toMatchObject({ kitchenId: 11, name: 'Alpha' });
    expect(c.res.headers.set).toHaveBeenCalledWith(
      'Cache-Control',
      expect.stringContaining('max-age')
    );
  });

  it('propagates Response when client returns Response', async () => {
    const resp = new Response(null, { status: 401 });
    vi.spyOn(typesMod, 'createGoPayClient').mockImplementation(() => ({
      getLocations: async () => resp,
    }) as any);

    const route = new GetLocations();
    const c = makeContext();
    const result = await route.handle(c);

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });
});
