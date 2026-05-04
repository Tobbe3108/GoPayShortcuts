import { describe, it, expect } from 'vitest';

describe('AuthForm helper behaviour (trim & otp transform)', () => {
  it('trims email input value (simulated transform)', () => {
    const input = '  user@example.com  ';
    const transformed = input.trim();
    expect(transformed).toBe('user@example.com');
  });

  it('strips non-digits from otp (simulated transform)', () => {
    const raw = '  12a3-45  ';
    const cleaned = raw.replace(/[^0-9]/g, '');
    expect(cleaned).toBe('12345');
  });
});
