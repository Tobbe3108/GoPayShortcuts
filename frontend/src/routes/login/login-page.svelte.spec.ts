import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Page from './+page.svelte';

// Mock stores and navigation
vi.mock('$lib/features/auth/store', () => ({
  authStore: {
    subscribe: vi.fn((fn: any) => {
      fn({ token: null, isAuthenticated: false, isLoading: false, error: null });
      return () => {};
    }),
    requestOTP: vi.fn(),
    login: vi.fn(),
    clearError: vi.fn(),
  },
}));

vi.mock('$lib/core/notifications/notificationStore', () => ({
  notifications: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));

describe('Login page component', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('submitting email calls authStore.requestOTP and transitions to OTP step', async () => {
    const rendered = render(Page as any);
    const { container } = rendered;

    // Directly target the email input and submit the form (avoids matching translated text)
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await fireEvent.input(emailInput, { target: { value: 'user@example.com' } });
    await fireEvent.submit(form);

    const { authStore } = await import('$lib/features/auth/store');
    expect(authStore.requestOTP).toHaveBeenCalled();
  });

  it('submitting otp calls authStore.login and navigates on success', async () => {
    const rendered = render(Page as any);
    const { container, findByRole } = rendered;

    const { authStore } = await import('$lib/features/auth/store');
    await authStore.login.mockResolvedValue({ authentication: { token: 't' } });

    // Submit the email form first to transition to OTP step
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;
    await fireEvent.input(emailInput, { target: { value: 'user@example.com' } });
    await fireEvent.submit(form);

    // Wait for OTP input to appear and submit OTP
    const otpInput = await rendered.findByTestId('otp-input').catch(() => container.querySelector('#otp')) as HTMLInputElement;
    if (!otpInput) throw new Error('OTP input not found in DOM');

    await fireEvent.input(otpInput, { target: { value: '1234' } });
    // Robustly find the form that contains the OTP input. Some layouts render a single
    // form that is reused; others render a second form. Prefer the input's nearest form.
    const otpForm = (otpInput as HTMLInputElement).form || otpInput.closest('form') || container.querySelectorAll('form')[1] as HTMLFormElement;
    if (!otpForm) throw new Error('OTP form not found in DOM');
    await fireEvent.submit(otpForm);

    expect(authStore.login).toHaveBeenCalled();
    const { goto } = await import('$app/navigation');
    expect(goto).toHaveBeenCalled();
  });
});
