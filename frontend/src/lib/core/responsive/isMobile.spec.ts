import { describe, it, expect } from 'vitest';
import { isMobile } from './isMobile';

describe('isMobile', () => {
  it('returns false when window is undefined (SSR)', () => {
    // simulate SSR by deleting global window
    // @ts-ignore
    const old = global.window;
    // @ts-ignore
    delete global.window;
    expect(isMobile()).toBe(false);
    // restore
    // @ts-ignore
    global.window = old;
  });

  it('returns true for small widths and false for large widths', () => {
    // @ts-ignore
    global.window = { innerWidth: 500 };
    expect(isMobile()).toBe(true);
    // @ts-ignore
    global.window = { innerWidth: 2000 };
    expect(isMobile()).toBe(false);
  });
});
