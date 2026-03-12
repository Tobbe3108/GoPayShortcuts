import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notifications } from './notificationStore';

describe('notifications store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('crypto', { randomUUID: () => 'notif-1' } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('adds and auto-removes notification after timeout', () => {
    const id = notifications.info('hello', 1000);
    const sub = notifications.subscribe((list) => {
      if (list.length > 0) {
        expect(list[0].id).toBe('notif-1');
      }
    });

    // advance time
    vi.advanceTimersByTime(1500);
    // after timeout, list should be empty
    notifications.subscribe((list) => expect(list).toHaveLength(0))();
    sub();
  });

  it('remove removes by id', () => {
    const id = notifications.success('ok', 0);
    notifications.remove('notif-1');
    notifications.subscribe((list) => expect(list).toHaveLength(0))();
  });
});
