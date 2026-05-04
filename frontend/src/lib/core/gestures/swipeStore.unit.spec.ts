import { describe, it, expect, vi } from 'vitest';
import { swipeStore } from './swipeStore';

describe('swipeStore (unit)', () => {
  it('setHandler stores and handleSwipe invokes it', () => {
    const fn = vi.fn();
    swipeStore.setHandler(fn as any);
    swipeStore.handleSwipe({ detail: { direction: 'right' } } as any);
    expect(fn).toHaveBeenCalled();
  });

  it('clearHandler resets to null', () => {
    swipeStore.setHandler((() => {}) as any);
    swipeStore.clearHandler();
    swipeStore.subscribe((s) => expect(s.handler).toBeNull())();
  });
});
