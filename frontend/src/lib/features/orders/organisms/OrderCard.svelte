<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { isToday, isFuture } from 'date-fns';
import Button from '$lib/components/atoms/Button.svelte';
import { templateOrderToSimplifiedOrder } from '$lib/features/orders/orderUtils';
	
	import { _ } from 'svelte-i18n';
import Label from '$lib/components/atoms/Label.svelte';
	import Card from '../../../components/atoms/Card.svelte';
	import EditModeControls from '../molecules/EditModeControls.svelte';
	import OrderEditor from '../molecules/OrderEditor.svelte';
    import { ordersService } from '../ordersService';
    import { notifications } from '$lib/core/notifications/notificationStore';
    import { calculateDeltaAmounts, formatDKK } from '../utils/orderAmountCalculator';
    import defaultStore, { templatesSignal } from '$lib/features/orders/defaultStore';
	import { locationsService } from '../../locations/locationsService';
	import type { SimplifiedOrder } from '../models/SimplifiedOrder';
	import type { TemplateOrder } from '$lib/features/orders/orderUtils';
	import type { Location } from '../../locations/location';

	type OrderCardProps = {
		order: SimplifiedOrder;
		onOrderChange?: (newOrderState: SimplifiedOrder[]) => void;
		onOrderCancel?: (date: string, kitchenId: number) => void;
		isEditing?: boolean;
	};

	let {
		order,
		onOrderChange = undefined,
		onOrderCancel = undefined,
		isEditing = false
	}: OrderCardProps = $props();

	let editMode = $state(isEditing);
	let originalOrder = $state(order);
	let saveAsDefault = $state(false);
	let locations = $state<Location[]>([]);
	let loading = $state(true);
	let showUseDefault = $state(false);
	let isBackendLoading = $state(false);
	let originalQuantities = $state<Map<number, number>>(new Map());

	// Append-only mode: when order is locked (all deliveries non-cancelable)
	const isLocked = $derived(order.cancelEnabled === false);
	const appendOnly = $derived(isLocked && editMode);

    onMount(async () => {
			await locationsService
				.getLocations()
					.then((res) => (locations = res))
					.finally(() => (loading = false));

			// initialize star state and showUseDefault from persisted preferred template only
			try {
			const exists = await checkPersistedDefault();
			saveAsDefault = exists; // star reflects persisted preferred
			showUseDefault = exists;
        } catch (e) {
            console.error('failed to read preferred template for order', e);
        }
        });


    // react to any template/preference changes elsewhere in the UI by
    // re-evaluating whether a persisted default exists for this card. The
    // defaultStore updates `templatesSignal` whenever templates/prefs change.
    let __tplUnsub: (() => void) | null = null;
    onMount(() => {
        __tplUnsub = templatesSignal.subscribe((_) => {
            // run check in background — don't block rendering
            (async () => {
                try {
                    const exists = await checkPersistedDefault();
                    // only update when changed to avoid unnecessary re-renders
                    if (saveAsDefault !== exists) saveAsDefault = exists;
                    if (showUseDefault !== exists) showUseDefault = exists;
                } catch (e) {
                    console.error('templatesSignal reaction failed', e);
                }
            })();
        });
    });
    onDestroy(() => {
        if (typeof __tplUnsub === 'function') __tplUnsub();
    });


	async function checkPersistedDefault(): Promise<boolean> {
		try {
			// Direct localStorage check: ensure there's an explicit preferred id for
			// the weekday and that the referenced template contains an order for
			// this kitchen with at least one orderline. This avoids any legacy
			// fallback and is deterministic.
			const prefRaw = localStorage.getItem('app.preferredByWeekday');
			if (!prefRaw) return false;
			let pref: Record<string, string | null>;
			try {
				pref = JSON.parse(prefRaw) as Record<string, string | null>;
			} catch (e) {
				return false;
			}
			const date = new Date(order.date);
			const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
			const d = date.getDay();
			const weekday = d >= 1 && d <= 5 ? (weekdayNames[d - 1] as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri') : null;
			if (!weekday) return false;
			const tplId = pref[weekday];
			if (!tplId) return false;
			const tplRaw = localStorage.getItem('app.defaultTemplates');
			if (!tplRaw) return false;
			let tplList: any[];
			try {
				tplList = JSON.parse(tplRaw) as any[];
			} catch (e) {
				return false;
			}
			const tpl = tplList.find((t) => t.id === tplId);
			if (!tpl || !Array.isArray(tpl.orders)) return false;
            const found = tpl.orders.find((o) => {
                if (o.locationId !== order.kitchenId) return false;
                if (!Array.isArray(o.orderlines) || o.orderlines.length === 0) return false;
                // ensure at least one orderline looks valid (has productId)
                return o.orderlines.some((l: any) => typeof l.productId === 'number');
            });
			// reject legacy runtime templates (ids created from legacy fallback)
			if (tpl.id && String(tpl.id).toLowerCase().includes('legacy')) return false;
			return Boolean(found);
		} catch (e) {
			console.error('checkPersistedDefault failed', e);
			return false;
		}
	}

	// Synchronous check used by template rendering to avoid any async timing
	// issues — reads the explicit client storage keys and verifies that the
	// referenced template contains an order for this kitchen.
	function hasPersistedDefaultSync(): boolean {
		try {
			const prefRaw = localStorage.getItem('app.preferredByWeekday');
			if (!prefRaw) return false;
			const pref = JSON.parse(prefRaw) as Record<string, string | null>;
			const date = new Date(order.date);
			const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
			const d = date.getDay();
			const weekday = d >= 1 && d <= 5 ? (weekdayNames[d - 1] as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri') : null;
			if (!weekday) return false;
			const id = pref[weekday];
			if (!id) return false;
			const tplRaw = localStorage.getItem('app.defaultTemplates');
			if (!tplRaw) return false;
			const tplList = JSON.parse(tplRaw) as any[];
            const tpl = tplList.find((t) => t.id === id);
            if (!tpl || !Array.isArray(tpl.orders)) return false;
            // Do not treat legacy runtime templates as persisted defaults
            if (typeof tpl.id === 'string' && tpl.id.toLowerCase().includes('legacy')) return false;
            const found = tpl.orders.some((o: any) => {
                if (!o) return false;
                // match on kitchen/location id only — be permissive about orderlines
                return Number(o.locationId) === Number(order.kitchenId);
            });
            return Boolean(found);
		} catch (e) {
			return false;
		}
	}

    function handleEdit() {
        editMode = true;
        // reset the "save as default" flag when entering edit mode
        saveAsDefault = false;
        // Snapshot current quantities for append-only validation
        originalQuantities = new Map(order.orderlines.map((line) => [line.productId, line.quantity]));
        // Snapshot the entire order so we can compute deltas after save/cancel
        try {
            originalOrder = JSON.parse(JSON.stringify(order));
        } catch (e) {
            originalOrder = order;
        }
    }

    async function handleToggleDefault() {
        // Determine weekday for preference operations
        const date = new Date(order.date);
        const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const d = date.getDay();
        const weekday = d >= 1 && d <= 5 ? (weekdayNames[d - 1] as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri') : null;

        if (!weekday) {
            notifications.error($_('orders.failedToSaveDefault'));
            return;
        }

        const wantOn = !saveAsDefault;

        if (wantOn) {
            // attempt to persist; only reflect success in UI after it completes
            const saved = await handleSaveAsDefault();
            if (saved) {
                saveAsDefault = true;
                notifications.success($_('orders.default.success'));
                try {
                    const exists = await checkPersistedDefault();
                    showUseDefault = exists;
                } catch (e) {
                    showUseDefault = true;
                }
            } else {
                saveAsDefault = false;
                notifications.error($_('orders.default.error'));
            }
        } else {
            // User turned the star off -> clear preferred for that weekday
            try {
                await defaultStore.setPreferredForWeekday(weekday, null);
                saveAsDefault = false;
                notifications.success($_('orders.default.cleared') ?? 'Default cleared');
                showUseDefault = false;
            } catch (e) {
                console.error('failed to clear preferred template', e);
                notifications.error($_('orders.default.error'));
            }
        }
    }

	function handleCancel() {
		const maybeTemplate = order as TemplateOrder;
		order = originalOrder;

		if (maybeTemplate.tempOrder) {
			order = {
				...order,
				orderlines: order.orderlines.map((l) => ({ ...l, quantity: 0 }))
			};
		}

		if (order.orderlines.every((line) => line.quantity === 0)) {
			handleDelete();
			return;
		}

		editMode = false;
		// clear the flag when cancelling edits
		saveAsDefault = false;
		return;
	}

    async function handleSave() {
		// Validate append-only constraint: no quantity decreases allowed
		if (isLocked) {
			for (const line of order.orderlines) {
				const originalQty = originalQuantities.get(line.productId) ?? 0;
				if (line.quantity < originalQty) {
					notifications.error($_('orders.cannotDecreaseQuantities'));
					return;
				}
			}
		}

		if (order.orderlines.every((line) => line.quantity === 0)) {
			handleDelete();
			return;
		}

		isBackendLoading = true;
		let orderSaveSucceeded = false;
		isBackendLoading = true;
        try {
            const response = await ordersService.updateDay({
                kitchenId: order.kitchenId,
                date: order.date,
                desiredOrders: order.orderlines
            });
            if (response) onOrderChange?.(response);
            orderSaveSucceeded = Boolean(response);
            if (orderSaveSucceeded) editMode = false;

            // Compute deltas and show notifications for the user
            try {
                const prev = originalOrder as SimplifiedOrder | undefined;
                let next: SimplifiedOrder | undefined;
                if (response && Array.isArray(response)) {
                    next = response.find((r) => r.kitchenId === order.kitchenId && r.date === order.date);
                }
                if (!next) next = { date: order.date, kitchenId: order.kitchenId, orderlines: [], cancelEnabled: false } as SimplifiedOrder;
                // If the previous snapshot was a client-only template (tempOrder),
                // treat it as non-existent for delta calculations to avoid
                // showing refund notifications for unpersisted orders.
                const prevForDelta = prev && (prev as any).tempOrder ? undefined : prev;
                if (prev && (prev as any).tempOrder) console.debug('Skipping prev-delta for tempOrder in save, using empty prev for delta calc');
                const { spent, refunded } = calculateDeltaAmounts(prevForDelta, next);
                if (spent > 0) {
                    const msg = spent > 0 && refunded === 0 ? `Spent ${formatDKK(spent)} on lunch order${next.orderlines.length > 1 ? 's' : ''}` : `Spent ${formatDKK(spent)}`;
                    notifications.success(msg);
                }
                if (refunded > 0) notifications.success(`Refunded ${formatDKK(refunded)}`);
            } catch (e) {
                console.error('Failed to compute/emit delta notifications', e);
            }
        } catch (err) {
            notifications.error($_('orders.failedToSave'));
        } finally {
            isBackendLoading = false;
        }

        // If this order was created from the default (a temp order), do not
        // update the default when saving — the user is placing a new order
        // from the template and we should avoid overwriting the template.
        const maybeTemplate = order as TemplateOrder;
        if (maybeTemplate.tempOrder) {
            // clear the flag and skip default save/notifications
            saveAsDefault = false;
            return;
        }

        // Always attempt to save the default after the order save attempt
        // (regardless of whether the API call succeeded). Update the star state
        // to reflect whether the default actually persisted.
        if (saveAsDefault) {
            const saved = await handleSaveAsDefault();
            // reflect saved state in the UI (keep star filled only if save succeeded)
            saveAsDefault = Boolean(saved);
            // show a success notification when default save actually succeeded
            if (saved) {
                // use a short success toast; reuse existing i18n key for the action label
                notifications.success($_('orders.default.success'));
            }
			else
			{
				notifications.error($_('orders.default.error'));
			}
        }
    }

    async function applyDefaultToThisOrder() {
        try {
            const res = await defaultStore.getTemplateForDateAndKitchen(new Date(order.date), order.kitchenId);
            if (!res) {
                notifications.info($_('orders.noSavedDefaultOrder'));
                return;
            }
            const converted = templateOrderToSimplifiedOrder(res.order, new Date(order.date));
            // inform parent to insert/replace the in-memory order
            onOrderChange?.([converted]);
            // update local view
            order = converted;
        } catch (e) {
            console.error('apply default failed', e);
        }
    }

    async function handleSaveAsDefault() {
        // Save this order as a per-weekday preferred template (client-only).
        // Preserve behavior: if order was created from a template (tempOrder), do not overwrite templates.
        const maybeTemplate = order as TemplateOrder;
        if (maybeTemplate.tempOrder) {
            // The order was created from a template (tempOrder). The user may
            // have edited it and intends to save this variant as the preferred
            // template for the weekday. Allow creating a new template in this
            // case rather than blocking the action.
            console.debug('handleSaveAsDefault: saving a tempOrder as a new template');
            // fallthrough: we'll create a new template below if no existing
            // preferred template is present for the weekday.
        }

        isBackendLoading = true;
        try {
            const date = new Date(order.date);
            const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
            const d = date.getDay();
            const weekday = d >= 1 && d <= 5 ? (weekdayNames[d - 1] as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri') : null;

            // prepare template-order
            const templateOrder = {
                id: `tord:${order.kitchenId}:${Date.now()}`,
                locationId: order.kitchenId,
                orderlines: order.orderlines
            };

            if (!weekday) return false;

            // Check if there's an existing preferred template for this weekday
            const existing = await defaultStore.getPreferredForWeekday(weekday);
            if (!existing) {
                // quick localStorage probe to surface permission issues early
                try {
                    localStorage.setItem('__gops_write_probe', '1');
                    localStorage.removeItem('__gops_write_probe');
                } catch (e) {
                    console.error('localStorage write probe failed', e);
                    notifications.error($_('orders.default.error') + ' — localStorage write failed.');
                    return false;
                }

                // create a new template and set as preferred
                console.debug('handleSaveAsDefault -> creating template for', weekday, 'kitchen', order.kitchenId);
                let tpl;
                try {
                    tpl = await defaultStore.createTemplate({ orders: [templateOrder], name: `Default - ${weekday}` });
                    console.debug('handleSaveAsDefault created template', tpl.id);
                } catch (e) {
                    console.error('createTemplate failed', e);
                    notifications.error($_('orders.default.error') + ' — createTemplate failed.');
                    return false;
                }

                try {
                    console.debug('handleSaveAsDefault -> setting preferred for', weekday, '->', tpl.id);
                    await defaultStore.setPreferredForWeekday(weekday, tpl.id);
                } catch (e) {
                    console.error('setPreferredForWeekday failed', e);
                    notifications.error($_('orders.default.error') + ' — setting preference failed.');
                    return false;
                }

                return true;
            }

            // Update (upsert) the template's order for this kitchen
            const updatedOrders = existing.orders ? [...existing.orders] : [];
            const idx = updatedOrders.findIndex((o) => o.locationId === order.kitchenId);
            if (idx >= 0) {
                updatedOrders[idx] = { ...updatedOrders[idx], orderlines: order.orderlines } as any;
            } else {
                updatedOrders.push(templateOrder as any);
            }

            console.debug('handleSaveAsDefault -> updating template', existing.id, 'orders', updatedOrders.length);
            try {
                await defaultStore.updateTemplate(existing.id, { orders: updatedOrders });
            } catch (e) {
                console.error('updateTemplate failed', e);
                notifications.error($_('orders.default.error') + ' — updateTemplate failed.');
                return false;
            }
            // ensure it's preferred for the weekday
            try {
                console.debug('handleSaveAsDefault -> ensuring preferred for', weekday, existing.id);
                await defaultStore.setPreferredForWeekday(weekday, existing.id);
            } catch (e) {
                console.error('setPreferredForWeekday failed', e);
                notifications.error($_('orders.default.error') + ' — setting preference failed.');
                return false;
            }
            return true;
        } catch (e) {
            console.error('handleSaveAsDefault failed', e);
            try {
                const msg = e instanceof Error ? e.message : String(e);
                notifications.error(`${$_('orders.default.error')}: ${msg}`);
            } catch (nerr) {
                // fall back
                notifications.error($_('orders.default.error'));
            }
            return false;
        } finally {
            isBackendLoading = false;
        }
    }

    async function handleDelete() {
        isBackendLoading = true;
        try {
            // Before issuing delete, capture a reliable "prev" snapshot. If the
            // client-side originalOrder appears empty (all zeros), try to fetch
            // the current server state for this date to compute an accurate
            // refund amount.
            let prev = originalOrder as SimplifiedOrder | undefined;
            const prevTotal = (prev?.orderlines || []).reduce((s, l) => s + l.price * l.quantity, 0);
            if (!prev || prevTotal === 0) {
                try {
                    const day = new Date(order.date);
                    const serverOrders = await ordersService.listOrders(day, day);
                    const serverPrev = serverOrders.find((r) => r.kitchenId === order.kitchenId && r.date === order.date);
                    if (serverPrev) prev = serverPrev;
                } catch (e) {
                    // ignore — we'll fall back to originalOrder
                    console.debug('Could not fetch server previous order for delete delta', e);
                }
            }

            const response = await ordersService.updateDay({
                kitchenId: order.kitchenId,
                date: order.date,
                desiredOrders: []
            });

            // Compute and show deltas (refunds/spent) between the previous
            // snapshot and the newly returned state (likely empty).
            try {
                // Use the prev captured above (originalOrder or server snapshot)
                let next: SimplifiedOrder | undefined;
                if (response && Array.isArray(response)) {
                    next = response.find((r) => r.kitchenId === order.kitchenId && r.date === order.date);
                }
                if (!next) next = { date: order.date, kitchenId: order.kitchenId, orderlines: [], cancelEnabled: false } as SimplifiedOrder;
                // Prevent showing refunds when deleting a client-only (temp) order.
                const prevForDelta = prev && (prev as any).tempOrder ? undefined : prev;
                if (prev && (prev as any).tempOrder) console.debug('Skipping prev-delta for tempOrder in delete, using empty prev for delta calc');
                const { spent, refunded } = calculateDeltaAmounts(prevForDelta, next);
                console.debug('Delete delta', { prev: prevForDelta, next, spent, refunded });
                if (spent > 0) notifications.success(`Spent ${formatDKK(spent)}`);
                if (refunded > 0) notifications.success(`Refunded ${formatDKK(refunded)}`);
            } catch (e) {
                console.error('Failed to compute/emit delta notifications for delete', e);
            }

            onOrderCancel?.(order.date, order.kitchenId);
        } catch (err) {
            notifications.error($_('orders.failedToCancel'));
        } finally {
            isBackendLoading = false;
        }
    }

	const kitchenName = $derived(() => {
		const location = locations.find((l) => l.kitchenId === order.kitchenId);
		return location?.name;
	});
</script>

{#if !loading}
	<Card>
        <!-- Header: name and actions on the same row; "Save as Default" always shown below the name when editing -->
        <div class="mb-2">
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                    <Label size="xl" className="capitalize tracking-wide truncate">{kitchenName()}</Label>

                    <!-- star control moved into EditModeControls; pass toggle props below -->
                </div>

                <div class="flex-shrink-0">
                    <EditModeControls
                        {isEditing}
                        direction="row"
                        locked={false}
                        {appendOnly}
                        disabled={isBackendLoading}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onDelete={handleDelete}
                        showDefaultToggle={editMode}
                        isDefault={saveAsDefault}
                        onToggleDefault={handleToggleDefault}
                    />
                </div>
            </div>
		</div>

		<!-- Defaults/application UI is handled by DefaultPlaceholder in the templates.
		     Do not render the save-as-default hint inside individual OrderCard
		     instances (prevents hint appearing after content loads). -->

		<OrderEditor
			{order}
			{editMode}
			{appendOnly}
			{originalQuantities}
			onOrderChange={(updatedOrder) => (order = updatedOrder)}
		/>
	</Card>
{/if}
