<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
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
		return;
	}

	async function handleSave() {
		// Validate append-only constraint: no quantity decreases allowed
		if (isLocked) {
			for (const line of order.orderlines) {
				const originalQty = originalQuantities.get(line.productId) ?? 0;
				if (line.quantity < originalQty) {
					notifications.error(
						'Cannot decrease quantities in a locked order. Only additions are allowed.'
					);
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
			notifications.info(undefined, 2500, 'Save as default?', async () => handleSaveAsDefault());
		} catch (err) {
			notifications.error('Failed to save order');
		} finally {
			isBackendLoading = false;
		}
	}

	async function handleSaveAsDefault() {
		isBackendLoading = true;
		try {
			await defaultStore.saveDefault(order);
		} catch (err) {
			notifications.error('Failed to save default order');
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
			notifications.error('Failed to cancel order');
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
		<div class="flex flex-row items-center justify-between mb-2">
			<Label size="xl" className="capitalize tracking-wide">{kitchenName()}</Label>
			<div class="flex items-center gap-2">
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
				/>
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
