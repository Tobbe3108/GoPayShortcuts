import { describe, it, expect } from 'vitest';
import { formatAmount } from './priceUtils';

describe('formatAmount edge cases', () => {
  it('handles zero scale correctly', () => {
    expect(formatAmount(123, 0)).toBe(123);
  });

  it('handles negative numbers', () => {
    expect(formatAmount(-150, 2)).toBe(-1.5);
  });
});
