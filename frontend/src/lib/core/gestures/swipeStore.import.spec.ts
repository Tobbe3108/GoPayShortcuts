import { describe, it, expect, vi } from 'vitest';
import { swipeStore } from '$lib/core/gestures/swipeStore';

describe('swipeStore (import path)', () => {
  it('setHandler and handleSwipe via $lib import', () => {
    const fn = vi.fn();
    swipeStore.setHandler(fn as any);
    swipeStore.handleSwipe({ detail: { direction: 'x' } } as any);
    expect(fn).toHaveBeenCalled();
  });

  it('clearHandler clears the handler', () => {
    // wrap the empty arrow function in parentheses so TypeScript-style "as any"
    // cast is valid for the test transformer used by esbuild
    swipeStore.setHandler((() => {}) as any);
    swipeStore.clearHandler();
    swipeStore.subscribe((s) => expect(s.handler).toBeNull())();
  });
});
