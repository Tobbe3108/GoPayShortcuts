import type { SimplifiedOrder } from './models/SimplifiedOrder';
import type { TemplateOrder as ModelTemplateOrder, DefaultTemplate } from './models/DefaultTemplate';
import { writable } from 'svelte/store';

// simple numeric signal incremented on templates/prefs changes so UI can
// subscribe and refresh checks across components
export const templatesSignal = writable(0);

const LEGACY_KEY = 'gops:defaultOrder';
const TEMPLATES_KEY = 'app.defaultTemplates';
const PREFERRED_KEY = 'app.preferredByWeekday';

type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

function nowIso() {
    return new Date().toISOString();
}

function readJson<T>(k: string): T | null {
    try {
        const raw = localStorage.getItem(k);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch (e) {
        console.error('readJson failed', k, e);
        return null;
    }
}

function writeJson(k: string, v: unknown) {
    try {
        localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
        console.error('writeJson failed', k, e);
        throw e;
    }
}

function genId(prefix = 'tpl') {
    try {
        // browser crypto available in modern runtimes
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${prefix}:${Date.now()}-${Math.floor(Math.random()*10000)}`;
    } catch (e) {
        return `${prefix}:${Date.now()}-${Math.floor(Math.random()*10000)}`;
    }
}

function defaultPreferredMap(): Record<Weekday, string | null> {
    return { Mon: null, Tue: null, Wed: null, Thu: null, Fri: null };
}

export const defaultStore = {
    // New API
    listTemplates: async (): Promise<DefaultTemplate[]> => {
        const t = readJson<DefaultTemplate[]>(TEMPLATES_KEY);
        return t ?? [];
    },

    getTemplate: async (id: string): Promise<DefaultTemplate | undefined> => {
        const list = await defaultStore.listTemplates();
        return list.find((l) => l.id === id);
    },

    createTemplate: async (partial: Partial<DefaultTemplate>): Promise<DefaultTemplate> => {
        const list = await defaultStore.listTemplates();
        const now = nowIso();
        const tpl: DefaultTemplate = {
            id: partial.id ?? genId('tpl'),
            name: partial.name ?? undefined,
            orders: partial.orders ?? [],
            createdAt: partial.createdAt ?? now,
            updatedAt: now
        };
        list.push(tpl);
        console.debug('defaultStore.createTemplate -> writing templates', tpl.id, tpl.orders?.length ?? 0);
        writeJson(TEMPLATES_KEY, list);
        // signal watchers that templates changed
        templatesSignal.update((n) => n + 1);
        return tpl;
    },

    updateTemplate: async (id: string, patch: Partial<DefaultTemplate>): Promise<DefaultTemplate> => {
        const list = await defaultStore.listTemplates();
        const idx = list.findIndex((l) => l.id === id);
        if (idx === -1) throw new Error('template not found');
        const existing = list[idx];
        const updated: DefaultTemplate = {
            ...existing,
            ...patch,
            updatedAt: nowIso()
        };
        list[idx] = updated;
        writeJson(TEMPLATES_KEY, list);
        // signal watchers that templates changed
        templatesSignal.update((n) => n + 1);
        return updated;
    },

    deleteTemplate: async (id: string): Promise<void> => {
        const list = await defaultStore.listTemplates();
        const filtered = list.filter((l) => l.id !== id);
        writeJson(TEMPLATES_KEY, filtered);

        // clear any preferredByWeekday entries referencing it
        const pref = readJson<Record<Weekday, string | null>>(PREFERRED_KEY) ?? defaultPreferredMap();
        let changed = false;
        (Object.keys(pref) as Weekday[]).forEach((d) => {
            if (pref[d] === id) {
                pref[d] = null;
                changed = true;
            }
        });
        if (changed) writeJson(PREFERRED_KEY, pref);
        // signal watchers that templates or preferences changed
        templatesSignal.update((n) => n + 1);
    },

    setPreferredForWeekday: async (weekday: Weekday, templateIdOrNull: string | null): Promise<void> => {
        const pref = readJson<Record<Weekday, string | null>>(PREFERRED_KEY) ?? defaultPreferredMap();
        pref[weekday] = templateIdOrNull;
        console.debug('defaultStore.setPreferredForWeekday ->', weekday, templateIdOrNull);
        writeJson(PREFERRED_KEY, pref);
        // notify listeners
        templatesSignal.update((n) => n + 1);
    },

    getPreferredForWeekday: async (weekday: Weekday): Promise<DefaultTemplate | null> => {
        const pref = readJson<Record<Weekday, string | null>>(PREFERRED_KEY) ?? defaultPreferredMap();
        const id = pref[weekday] ?? null;
        if (!id) {
            // read-only legacy fallback: try to read LEGACY_KEY and return a runtime-only template
            try {
                const raw = readJson<SimplifiedOrder>(LEGACY_KEY);
                if (raw && typeof raw.kitchenId === 'number') {
                    // construct a runtime-only template from legacy single-order
                    const tpl: DefaultTemplate = {
                        id: genId('legacy'),
                        name: `Legacy - ${weekday}`,
                        orders: [
                            {
                                id: genId('tord'),
                                locationId: raw.kitchenId,
                                orderlines: raw.orderlines ?? []
                            } as ModelTemplateOrder
                        ],
                        createdAt: nowIso(),
                        updatedAt: nowIso()
                    };
                    return tpl;
                }
            } catch (e) {
                // ignore
            }
            return null;
        }
        const tpl = await defaultStore.getTemplate(id);
        return tpl ?? null;
    },

    // Return the raw preferred map as stored (persisted only). Useful for admin
    // UIs that want to render which template id is preferred for which day.
    getPreferredMap: async (): Promise<Record<Weekday, string | null>> => {
        return readJson<Record<Weekday, string | null>>(PREFERRED_KEY) ?? defaultPreferredMap();
    },

    getTemplateForDateAndKitchen: async (date: Date, kitchenId: number): Promise<{ template: DefaultTemplate; order: ModelTemplateOrder } | null> => {
        const weekdayNames: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const d = date.getDay();
        // JS getDay: 0=Sun,1=Mon.. so index d-1
        const weekday = d >= 1 && d <= 5 ? weekdayNames[d - 1] : null;
        if (!weekday) return null;

        const pref = readJson<Record<Weekday, string | null>>(PREFERRED_KEY) ?? defaultPreferredMap();
        const id = pref[weekday];
        if (!id) {
            // No preferred template set for this weekday. Do not treat legacy
            // fallback as a persisted template here — return null to indicate
            // there is no stored preferred template for this weekday.
            return null;
        }

        const tpl = await defaultStore.getTemplate(id);
        if (!tpl) return null;
        const found = tpl.orders.find((o) => o.locationId === kitchenId);
        if (!found) return null;
        return { template: tpl, order: found };
    },

    // Returns true only if a persisted preferred template exists for the
    // provided date and kitchen. This explicitly excludes the legacy
    // `gops:defaultOrder` runtime fallback.
    hasPersistedTemplateForDateAndKitchen: async (date: Date, kitchenId: number): Promise<boolean> => {
        const weekdayNames: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const d = date.getDay();
        const weekday = d >= 1 && d <= 5 ? weekdayNames[d - 1] : null;
        if (!weekday) return false;
        const pref = readJson<Record<Weekday, string | null>>(PREFERRED_KEY) ?? defaultPreferredMap();
        const id = pref[weekday];
        if (!id) return false;
        const tpl = await defaultStore.getTemplate(id);
        if (!tpl) return false;
        const found = tpl.orders.find((o) => o.locationId === kitchenId);
        return Boolean(found);
    },

    // Backwards-compat: preserve old API surface for parts of the app not updated yet.
    getDefault: async (): Promise<SimplifiedOrder | null> => {
        // read-only: return legacy key if present (do not write/migrate)
        try {
            const raw = readJson<SimplifiedOrder>(LEGACY_KEY);
            if (!raw) return null;
            return raw;
        } catch (e) {
            return null;
        }
    },

    // convenience wrapper used by older code: create a template and mark it preferred for the order's weekday
    saveDefault: async (order: SimplifiedOrder): Promise<DefaultTemplate> => {
        if (!order || !order.date) throw new Error('Invalid order');
        if (!order.orderlines || order.orderlines.length === 0) throw new Error('Cannot save empty order as default');
        const date = new Date(order.date);
        const weekdayNames: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const d = date.getDay();
        const weekday = d >= 1 && d <= 5 ? weekdayNames[d - 1] : null;
        const tplOrder: ModelTemplateOrder = { id: genId('tord'), locationId: order.kitchenId, orderlines: order.orderlines };
        const tpl = await defaultStore.createTemplate({ orders: [tplOrder], name: `Default - ${weekday ?? 'Day'}` });
        if (weekday) await defaultStore.setPreferredForWeekday(weekday, tpl.id);
        return tpl;
    },

    deleteDefault: async (): Promise<void> => {
        // no-op for legacy deletion; do not touch legacy key
        return;
    }
};

export default defaultStore;
