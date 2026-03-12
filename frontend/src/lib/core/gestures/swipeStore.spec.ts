import { describe, it, expect, vi, beforeEach } from 'vitest';
import { swipeStore } from './swipeStore';

describe('swipeStore', () => {
  beforeEach(() => {
    // reset handler
    swipeStore.clearHandler();
  });

  it('sets and calls handler on handleSwipe', () => {
    const handler = vi.fn();
    swipeStore.setHandler(handler as any);

    const fakeEvent = { detail: { x: 1 } } as any;
    swipeStore.handleSwipe(fakeEvent);

    expect(handler).toHaveBeenCalledWith(fakeEvent);
  });

  it('clearHandler resets handler to null', () => {
    const handler = vi.fn();
    swipeStore.setHandler(handler as any);
    swipeStore.clearHandler();

    // call swipe should not call handler
    swipeStore.handleSwipe({} as any);
    expect(handler).not.toHaveBeenCalled();
  });
});
