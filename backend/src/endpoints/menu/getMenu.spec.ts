import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GetMenu } from './getMenu';
import * as typesMod from '../../types';

const makeContext = () => ({
  req: { header: vi.fn(() => undefined) },
  res: { headers: { set: vi.fn() } },
} as any);

describe('GetMenu route', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('parses menu items and returns simplified menu', async () => {
    const meyersResp = {
      '2023-01-01': {
        items: [
          { menu_name: 'Main - Side', item_category: 'cat', allergens: { gluten: true, nuts: false } },
        ],
      },
    };

    vi.spyOn(typesMod, 'createMeyersClient').mockImplementation(() => ({
      getMenu: async () => meyersResp,
    }) as any);

    const route = new GetMenu();
    const c = makeContext();
    const result = await route.handle(c);

    expect(Array.isArray(result)).toBe(true);
    const day = result.find((d: any) => d.date === '2023-01-01');
    expect(day).toBeDefined();
    expect(day.items[0].item).toBe('Main');
    expect(day.items[0].subItems).toEqual(['Side']);
    expect(day.items[0].category).toBe('cat');
    expect(day.items[0].allergens).toEqual(['gluten']);
    expect(c.res.headers.set).toHaveBeenCalled();
  });

  it('returns Response when upstream returns Response (404)', async () => {
    const resp = new Response(null, { status: 404 });
    vi.spyOn(typesMod, 'createMeyersClient').mockImplementation(() => ({
      getMenu: async () => resp,
    }) as any);

    const route = new GetMenu();
    const c = makeContext();
    const result = await route.handle(c);

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(404);
  });
});
