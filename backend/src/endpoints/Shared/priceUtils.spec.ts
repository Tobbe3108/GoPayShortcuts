import { describe, it, expect } from 'vitest';
import { formatAmount } from './priceUtils';

describe('formatAmount', () => {
  it('formats integer cents to decimal', () => {
    expect(formatAmount(199, 2)).toBe(1.99);
    expect(formatAmount(1000, 3)).toBe(1);
  });
});
