import { describe, it, expect, beforeEach, vi } from 'vitest';
import defaultStore, { templatesSignal } from './defaultStore';

// Keys used by the store
const TEMPLATES_KEY = 'app.defaultTemplates';
const PREFERRED_KEY = 'app.preferredByWeekday';
const LEGACY_KEY = 'gops:defaultOrder';

function mockLocalStorage() {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
    _dump: () => ({ ...store }),
  };
}

describe('defaultStore', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // provide deterministic ids
    vi.stubGlobal('crypto', { randomUUID: () => 'uuid-1' } as any);
    // mock localStorage
    // @ts-ignore
    global.localStorage = mockLocalStorage();
  });

  it('listTemplates returns empty when none', async () => {
    const list = await defaultStore.listTemplates();
    expect(list).toEqual([]);
  });

  it('createTemplate persists and getTemplate retrieves it', async () => {
    const tpl = await defaultStore.createTemplate({ name: 'X', orders: [] });
    expect(tpl.id).toBeDefined();
    const raw = JSON.parse((localStorage as any).getItem(TEMPLATES_KEY)!);
    expect(raw).toHaveLength(1);
    const got = await defaultStore.getTemplate(tpl.id);
    expect(got?.name).toBe('X');
  });

  it('updateTemplate updates fields and updatedAt', async () => {
    const tpl = await defaultStore.createTemplate({ name: 'A' });
    const updated = await defaultStore.updateTemplate(tpl.id, { name: 'B' });
    expect(updated.name).toBe('B');
    expect(typeof updated.updatedAt).toBe('string');
  });

  it('deleteTemplate removes template and clears preferred entries referencing it', async () => {
    const tpl = await defaultStore.createTemplate({ name: 'ToDel' });
    // set preferred map to reference the template
    const pref = { Mon: tpl.id, Tue: null, Wed: null, Thu: null, Fri: null };
    localStorage.setItem(PREFERRED_KEY, JSON.stringify(pref));

    await defaultStore.deleteTemplate(tpl.id);
    const storedPref = JSON.parse(localStorage.getItem(PREFERRED_KEY)!);
    expect(storedPref.Mon).toBeNull();
  });

  it('setPreferredForWeekday writes preferred map', async () => {
    await defaultStore.setPreferredForWeekday('Tue', 'tpl-9');
    const stored = JSON.parse(localStorage.getItem(PREFERRED_KEY)!);
    expect(stored.Tue).toBe('tpl-9');
  });

  it('getPreferredForWeekday returns legacy template when no pref and legacy exists', async () => {
    // write legacy order
    const legacy = { kitchenId: 42, orderlines: [{ productId: 1, quantity: 2 }] };
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacy));
    const tpl = await defaultStore.getPreferredForWeekday('Mon');
    expect(tpl).not.toBeNull();
    expect(tpl?.orders[0].locationId).toBe(42);
  });

  it('getTemplateForDateAndKitchen returns template when preferred set', async () => {
    const monday = new Date('2026-03-16'); // Monday
    const tpl = await defaultStore.createTemplate({ name: 'P', orders: [{ id: 'o1', locationId: 7, orderlines: [] }] as any });
    // set preferred map to this tpl for Mon
    await defaultStore.setPreferredForWeekday('Mon', tpl.id);
    const res = await defaultStore.getTemplateForDateAndKitchen(monday, 7);
    expect(res).not.toBeNull();
    expect(res?.order.locationId).toBe(7);
  });

  it('hasPersistedTemplateForDateAndKitchen returns true when template exists', async () => {
    const monday = new Date('2026-03-16');
    const tpl = await defaultStore.createTemplate({ orders: [{ id: 'o2', locationId: 9, orderlines: [] }] as any });
    await defaultStore.setPreferredForWeekday('Mon', tpl.id);
    const ok = await defaultStore.hasPersistedTemplateForDateAndKitchen(monday, 9);
    expect(ok).toBe(true);
  });

  it('saveDefault creates a template and sets preferred when valid', async () => {
    const order = { date: '2026-03-16', kitchenId: 55, orderlines: [{ productId: 2, quantity: 1 }] } as any;
    const tpl = await defaultStore.saveDefault(order);
    expect(tpl).toBeDefined();
    const pref = JSON.parse(localStorage.getItem(PREFERRED_KEY)!);
    expect(Object.values(pref)).toContain(tpl.id);
  });

  it('saveDefault throws on invalid order', async () => {
    await expect(defaultStore.saveDefault({} as any)).rejects.toBeInstanceOf(Error);
    await expect(defaultStore.saveDefault({ date: '2026-01-01', kitchenId: 1, orderlines: [] } as any)).rejects.toBeInstanceOf(Error);
  });
});
