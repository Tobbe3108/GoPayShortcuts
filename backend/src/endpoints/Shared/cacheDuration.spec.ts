import { describe, it, expect } from 'vitest';
import { seconds, minutes, hours, days, cacheDuration } from './cacheDuration';

describe('cacheDuration helpers', () => {
  it('seconds returns correct multipliers', () => {
    expect(seconds(2)).toBe(2);
    expect(cacheDuration.seconds(5)).toBe(5);
  });

  it('minutes/hours/days compose correctly', () => {
    expect(minutes(1)).toBe(60);
    expect(hours(1)).toBe(3600);
    expect(days(1)).toBe(86400);
  });
});
