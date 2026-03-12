import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { navigationStore } from './store';
import { get } from 'svelte/store';

describe('navigationStore', () => {
  let original: any;

  beforeEach(() => {
    // snapshot original state to restore after tests
    original = get(navigationStore);
    // reset to known state
    navigationStore.set({ currentDate: new Date('2026-03-12'), collapsedByDay: new Map() });
  });

  afterEach(() => {
    navigationStore.set(original);
  });

  it('nextDay skips weekend (Friday -> Monday)', () => {
    navigationStore.set({ currentDate: new Date('2026-03-13'), collapsedByDay: new Map() }); // 2026-03-13 is Friday
    navigationStore.nextDay();
    const state = get(navigationStore);
    expect(state.currentDate.toISOString().slice(0, 10)).toBe('2026-03-16'); // Monday
  });

  it('prevDay skips weekend (Monday -> Friday)', () => {
    navigationStore.set({ currentDate: new Date('2026-03-16'), collapsedByDay: new Map() }); // Monday
    navigationStore.prevDay();
    const state = get(navigationStore);
    expect(state.currentDate.toISOString().slice(0, 10)).toBe('2026-03-13'); // Friday
  });

  it('toggleMenu toggles collapsed state for a date', () => {
    const d = new Date('2026-03-12');
    expect(navigationStore.isCollapsed(d)).toBe(true);
    navigationStore.toggleMenu(d);
    expect(navigationStore.isCollapsed(d)).toBe(false);
    navigationStore.toggleMenu(d);
    expect(navigationStore.isCollapsed(d)).toBe(true);
  });

  it('collapseMenu and expandMenu update current date key', () => {
    navigationStore.set({ currentDate: new Date('2026-03-12'), collapsedByDay: new Map() });
    navigationStore.expandMenu();
    expect(navigationStore.isCollapsed()).toBe(false);
    navigationStore.collapseMenu();
    expect(navigationStore.isCollapsed()).toBe(true);
  });

  it('setDate updates currentDate', () => {
    navigationStore.setDate(new Date('2026-04-01'));
    const state = get(navigationStore);
    expect(state.currentDate.toISOString().slice(0, 10)).toBe('2026-04-01');
  });
});
