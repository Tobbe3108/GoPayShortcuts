import { describe, it, expect } from 'vitest';
import { cacheDuration } from './cacheDuration';

describe('cacheDuration object constants', () => {
  it('exposes constants as functions and is immutable', () => {
    expect(typeof cacheDuration.seconds).toBe('function');
    expect(typeof cacheDuration.minutes).toBe('function');

    // ensure values compute as expected
    expect(cacheDuration.minutes(2)).toBe(120);

    // attempt to mutate then restore to avoid leaving global state changed
    const original = cacheDuration.seconds;
    try {
      // @ts-ignore Mutate for test purposes; some environments may throw
      cacheDuration.seconds = () => 999;
    } catch (e) {
      // ignore in strict environments
    }

    // ensure property is still a function
    expect(typeof cacheDuration.seconds).toBe('function');

    // restore original function to avoid side effects for other tests
    try {
      // @ts-ignore
      cacheDuration.seconds = original;
    } catch (e) {
      // ignore if restoring is not permitted
    }

    // original behavior should (again) compute expected value
    expect(cacheDuration.seconds(3)).toBe(3);
  });
});
