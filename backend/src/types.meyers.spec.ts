import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./meyers/client', () => {
  return {
    MeyersClient: vi.fn().mockImplementation((apiUrl: string) => ({ apiUrl })),
  };
});

import { createMeyersClient } from './types';
import { MeyersClient } from './meyers/client';

describe('createMeyersClient', () => {
  beforeEach(() => vi.clearAllMocks());

  it('constructs MeyersClient with MEYERS_API_URL from context', () => {
    const ctx: any = { env: { MEYERS_API_URL: 'https://m.example' } };
    const client = createMeyersClient(ctx as any);
    expect((MeyersClient as any)).toHaveBeenCalledWith('https://m.example');
    expect(client).toEqual({ apiUrl: 'https://m.example' });
  });
});
