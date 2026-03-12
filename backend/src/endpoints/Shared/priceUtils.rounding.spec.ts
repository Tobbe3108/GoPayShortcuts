import { describe, it, expect } from 'vitest';
import { formatAmount } from './priceUtils';

describe('formatAmount rounding behavior', () => {
  it('preserves precision for amounts that result in repeating decimals', () => {
    // amount 1 with scale 3 -> 0.001
    expect(formatAmount(1, 3)).toBeCloseTo(0.001);
    // amount 10 with scale 3 -> 0.01
    expect(formatAmount(10, 3)).toBeCloseTo(0.01);
  });
});
