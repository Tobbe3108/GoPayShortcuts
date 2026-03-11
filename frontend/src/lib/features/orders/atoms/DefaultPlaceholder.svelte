<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    import Button from '$lib/components/atoms/Button.svelte';
    import { _ } from 'svelte-i18n';
    import { templateOrderToSimplifiedOrder } from '$lib/features/orders/orderUtils';
    import defaultStore, { templatesSignal } from '$lib/features/orders/defaultStore';
    import { notifications } from '$lib/core/notifications/notificationStore';
    
    export let date: string;
    // optional: if provided, the placeholder acts for a specific kitchen;
    // otherwise it applies the whole preferred template for the weekday
    export let kitchenId: number | null = null;

    const dispatch = createEventDispatcher();

    let showUseDefault = false;
    let mounted = false;

    async function checkAsync() {
        try {
            if (kitchenId == null) {
                // day-level: check if a persisted preferred template exists for the weekday
                const pref = await defaultStore.getPreferredMap();
                const d = new Date(date).getDay();
                const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                const weekday = d >= 1 && d <= 5 ? (weekdayNames[d - 1] as any) : null;
                if (!weekday) {
                    showUseDefault = false;
                } else {
                    const id = pref[weekday];
                    if (!id) showUseDefault = false;
                    else {
                        const tpl = await defaultStore.getTemplate(id);
                        showUseDefault = Boolean(tpl && Array.isArray(tpl.orders) && tpl.orders.length > 0 && !String(tpl.id).toLowerCase().includes('legacy'));
                    }
                }
            } else {
                const exists = await defaultStore.hasPersistedTemplateForDateAndKitchen(new Date(date), kitchenId);
                showUseDefault = exists;
            }
        } catch (e) {
            console.error('DefaultPlaceholder async check failed', e);
            showUseDefault = false;
        }
    }

    function hasPersistedDefaultSync(): boolean {
        try {
            const prefRaw = localStorage.getItem('app.preferredByWeekday');
            if (!prefRaw) return false;
            const pref = JSON.parse(prefRaw) as Record<string, string | null>;
            const d = new Date(date).getDay();
            const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
            const weekday = d >= 1 && d <= 5 ? (weekdayNames[d - 1] as any) : null;
            if (!weekday) return false;
            const id = pref[weekday];
            if (!id) return false;
            const tplRaw = localStorage.getItem('app.defaultTemplates');
            if (!tplRaw) return false;
            const tplList = JSON.parse(tplRaw) as any[];
            const tpl = tplList.find((t) => t.id === id);
            if (!tpl || !Array.isArray(tpl.orders)) return false;
            if (typeof tpl.id === 'string' && tpl.id.toLowerCase().includes('legacy')) return false;
            if (kitchenId == null) return tpl.orders.length > 0;
            return tpl.orders.some((o: any) => Number(o.locationId) === Number(kitchenId));
        } catch (e) {
            return false;
        }
    }

    async function applyDefault() {
        try {
            if (kitchenId == null) {
                // apply entire template for the weekday
                const pref = await defaultStore.getPreferredMap();
                const d = new Date(date).getDay();
                const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                const weekday = d >= 1 && d <= 5 ? (weekdayNames[d - 1] as any) : null;
                if (!weekday) {
                    notifications.info($_('orders.noSavedDefaultOrder'));
                    return;
                }
                const id = pref[weekday];
                if (!id) {
                    notifications.info($_('orders.noSavedDefaultOrder'));
                    return;
                }
                const tpl = await defaultStore.getTemplate(id);
                if (!tpl) {
                    notifications.info($_('orders.noSavedDefaultOrder'));
                    return;
                }
                const converted = tpl.orders.map((o: any) => templateOrderToSimplifiedOrder(o, new Date(date)));
                dispatch('apply', converted);
                return;
            }

            const res = await defaultStore.getTemplateForDateAndKitchen(new Date(date), kitchenId);
            if (!res) {
                notifications.info($_('orders.noSavedDefaultOrder'));
                return;
            }
            const converted = templateOrderToSimplifiedOrder(res.order, new Date(date));
            dispatch('apply', converted);
        } catch (e) {
            console.error('apply default failed', e);
        }
    }

    let unsub: (() => void) | null = null;
    onMount(() => {
        mounted = true;
        // synchronous guard to avoid flashing
        showUseDefault = hasPersistedDefaultSync();
        // authoritative async check
        checkAsync();
        unsub = templatesSignal.subscribe(() => {
            // re-evaluate on changes
            checkAsync();
        });
    });

    onDestroy(() => {
        if (unsub) unsub();
    });
</script>

<div class="h-10 flex items-center justify-center">
    {#if showUseDefault}
        <Button variant="transparent" size="sm" ariaLabel={$_('orders.useDefaultOrder')} onclick={applyDefault}>
            <div class="text-xs text-gray-400 text-center">{$_('orders.useDefaultOrder')}</div>
        </Button>
    {:else}
        <div class="text-xs text-gray-400 text-center">{$_('orders.saveAsDefaultHint')}</div>
    {/if}
</div>
