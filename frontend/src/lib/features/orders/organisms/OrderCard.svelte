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
		try {
			const response = await ordersService.updateDay({
				kitchenId: order.kitchenId,
				date: order.date,
				desiredOrders: order.orderlines
			});
			if (response) onOrderChange?.(response);
			editMode = false;
			// If the user checked "save as default" while editing, persist it
			if (saveAsDefault) {
				// call the existing helper which handles loading state and errors
				await handleSaveAsDefault();
				// reset flag after attempting to save as default
				saveAsDefault = false;
			} else {
				// Keep the previous transient hint for users who didn't check the box
				notifications.info(undefined, 2500, $_('orders.saveAsDefault'), async () =>
					handleSaveAsDefault()
				);
			}
		} catch (err) {
			notifications.error($_('orders.failedToSave'));
		} finally {
			isBackendLoading = false;
		}
	}

	async function handleSaveAsDefault() {
		isBackendLoading = true;
		try {
			await defaultStore.saveDefault(order);
		} catch (err) {
			notifications.error($_('orders.failedToSaveDefault'));
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
