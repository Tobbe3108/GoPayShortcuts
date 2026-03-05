<script lang="ts">
	import { onMount } from 'svelte';
	
	import { _ } from 'svelte-i18n';
import Label from '$lib/components/atoms/Label.svelte';
	import Card from '../../../components/atoms/Card.svelte';
	import EditModeControls from '../molecules/EditModeControls.svelte';
	import OrderEditor from '../molecules/OrderEditor.svelte';
	import { ordersService } from '../ordersService';
	import { notifications } from '$lib/core/notifications/notificationStore';
	import defaultStore from '$lib/features/orders/defaultStore';
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

		// initialize star state from persisted default for this kitchen
		try {
			const def = await defaultStore.getDefault();
			saveAsDefault = def?.id === `global:${order.kitchenId}`;
		} catch (e) {
			// ignore
		}
	});

	function handleEdit() {
		editMode = true;
		originalOrder = order;
		// reset the "save as default" flag when entering edit mode
		saveAsDefault = false;
		// Snapshot current quantities for append-only validation
		originalQuantities = new Map(order.orderlines.map((line) => [line.productId, line.quantity]));
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

	async function handleSaveAsDefault() {
		// Attempt to persist the order as the user's default.
		// This operation is intentionally silent (no user-facing notifications)
		// — callers decide whether to inform the user. We still catch errors
		// to avoid throwing from UI flows.
		isBackendLoading = true;
		try {
			await defaultStore.saveDefault(order);
			return true;
		} catch (err) {
			// swallow errors silently to avoid spamming notifications when
			// saving default is a best-effort action (localStorage may be blocked)
			console.error('default save failed', err);
			return false;
		} finally {
			isBackendLoading = false;
		}
	}

	async function handleDelete() {
		isBackendLoading = true;
		try {
			await ordersService.updateDay({
				kitchenId: order.kitchenId,
				date: order.date,
				desiredOrders: []
			});
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
                        onToggleDefault={() => (saveAsDefault = !saveAsDefault)}
                    />
                </div>
            </div>
        </div>
		<OrderEditor
			{order}
			{editMode}
			{appendOnly}
			{originalQuantities}
			onOrderChange={(updatedOrder) => (order = updatedOrder)}
		/>
	</Card>
{/if}
