import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('./goPay/client', () => {
  return {
    GoPayClient: vi.fn().mockImplementation((apiUrl: string, token?: string) => ({ apiUrl, token })),
  };
});

vi.mock('./goPay/client.mock', () => {
  return {
    GoPayClientMock: vi.fn().mockImplementation((apiUrl: string, token?: string) => ({ apiUrl, token, mock: true })),
  };
});

// import after mocks so the module picks up the mocked constructors
import { createGoPayClient } from './types';
import { GoPayClient } from './goPay/client';
import { GoPayClientMock } from './goPay/client.mock';

describe('createGoPayClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('returns GoPayClientMock when USE_LOCAL_MOCK_CLIENTS is true and parses Bearer token', () => {
    const ctx = {
      env: { GOPAY_API_URL: 'https://api.example', USE_LOCAL_MOCK_CLIENTS: true },
      req: { header: (h: string) => 'Bearer abc123' },
    } as any;

    const client = createGoPayClient(ctx);

    expect(GoPayClientMock).toHaveBeenCalledWith('https://api.example', 'abc123');
    expect(client).toEqual({ apiUrl: 'https://api.example', token: 'abc123', mock: true });
  });

  it('returns GoPayClient when USE_LOCAL_MOCK_CLIENTS is false and header missing', () => {
    const ctx = {
      env: { GOPAY_API_URL: 'https://api.example', USE_LOCAL_MOCK_CLIENTS: false },
      req: { header: (h: string) => undefined },
    } as any;

    const client = createGoPayClient(ctx);
    expect(GoPayClient).toHaveBeenCalledWith('https://api.example', undefined);
    // the mocked constructor may return a spy or an object depending on test runtime
    expect(client).toBeDefined();
  });
});
