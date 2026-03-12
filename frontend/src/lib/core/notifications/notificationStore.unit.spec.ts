import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { notifications } from './notificationStore';

describe('notificationStore (unit)', () => {
  beforeEach(() => {
    // clear existing notifications by replacing store
    // can't directly reset writable, so remove any via subscribe
    notifications.remove = notifications.remove || ((id: string) => {});
  });

  it('adds and removes a notification', () => {
    const id = notifications.info('hello', 0);
    let seen: any[] = [];
    const unsub = notifications.subscribe((v: any) => (seen = v));

    expect(seen.find((n: any) => n.id === id)).toBeDefined();

    notifications.remove(id);
    expect(seen.find((n: any) => n.id === id)).toBeUndefined();
    unsub();
  });
});
