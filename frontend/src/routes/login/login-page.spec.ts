import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock SvelteKit environment before importing modules that read it at top-level
vi.mock('$app/environment', () => ({
  browser: true,
  dev: false,
  building: false,
  version: 'test'
}));

// Provide a mocked apiClient so importing modules don't pull in SvelteKit runtime
vi.mock('$lib/core/api/apiClient', () => {
  const requestOtpSpy = vi.fn();
  const loginSpy = vi.fn();
  return {
    apiClient: { requestOTP: requestOtpSpy, login: loginSpy },
    // expose spies for tests to configure
    __spies: { requestOtpSpy, loginSpy }
  };
});

// Tests touching auth behaviour should mock the auth store explicitly
vi.mock('$lib/core/notifications/notificationStore', () => ({
  notifications: { error: vi.fn(), success: vi.fn() }
}));

// ensure a DOM-friendly localStorage is available before importing the auth store
(globalThis as any).localStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

import { authStore } from '../../lib/features/auth/store';

// Will be populated from the mocked module in beforeEach
let requestOtpSpy: any;
let loginSpy: any;

describe('authStore (unit)', () => {
  beforeEach(async () => {
    // preserve hoisted module mocks; only clear test mocks between runs
    vi.clearAllMocks();
    // import the mocked apiClient to access spies created inside the mock factory
    const mocked = await vi.importMock('$lib/core/api/apiClient');
    requestOtpSpy = mocked.__spies.requestOtpSpy;
    loginSpy = mocked.__spies.loginSpy;
  });

  it('requestOTP calls apiClient.requestOTP and does not set token', async () => {
    requestOtpSpy.mockResolvedValue({ authentication: { token: 'otp-token' }, serviceResponse: { isUserMessage: true } } as any);

    await authStore.requestOTP('user@example.com');

    expect(requestOtpSpy).toHaveBeenCalled();
    // read current store state via subscribe (avoid importing svelte/store.get)
    let state: any;
    const unsub = authStore.subscribe((s) => (state = s));
    unsub();
    expect(state.isLoading).toBe(false);
    // token is not set by requestOTP
    expect(state.token).toBe(null);
  });

  it('login sets token and isAuthenticated on success', async () => {
    // apiClient.login resolves to an object with `token` at top-level
    loginSpy.mockResolvedValue({ token: 'login-token', user: { id: 1 } } as any);

    await authStore.login('12345');

    expect(loginSpy).toHaveBeenCalled();
    let state: any;
    const unsub = authStore.subscribe((s) => (state = s));
    unsub();
    expect(state.token).toBe('login-token');
    expect(state.isAuthenticated).toBe(true);
  });
});
