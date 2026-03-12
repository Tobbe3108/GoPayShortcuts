import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./MenuDataProcessor', () => {
  return {
    MenuDataProcessor: {
      extractMenuItems: vi.fn().mockReturnValue({ processed: true }),
    },
  };
});

import { MeyersClient } from './client';
import { MenuDataProcessor } from './MenuDataProcessor';

describe('MeyersClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetch with the expected URL and returns processed data', async () => {
    const apiUrl = 'https://meyers.example';
    const rawResponse = { something: 'raw' };

    // Override global fetch which is blocked by test setup
    vi.stubGlobal('fetch', async (url: string, options?: any) => {
      expect(url).toBe(`${apiUrl}/internal/load/frontend`);
      return {
        ok: true,
        json: async () => rawResponse,
      } as any;
    });

    const client = new MeyersClient(apiUrl);
    const result = await client.getMenu();

    expect(MenuDataProcessor.extractMenuItems).toHaveBeenCalledWith(rawResponse);
    expect(result).toEqual({ processed: true });
  });

  it('returns Response when fetch is not ok', async () => {
    const apiUrl = 'https://meyers.example';

    vi.stubGlobal('fetch', async () => {
      return { ok: false, status: 502 } as any;
    });

    const client = new MeyersClient(apiUrl);
    const result = await client.getMenu();
    expect((result as any).status).toBe(502);
  });
});
