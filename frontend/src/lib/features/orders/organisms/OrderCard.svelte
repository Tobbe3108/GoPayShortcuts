<script lang="ts">
	import Label from '$lib/components/atoms/Label.svelte';
	import Card from '../../../components/atoms/Card.svelte';
	import EditModeControls from '../molecules/EditModeControls.svelte';
	import OrderEditor from '../molecules/OrderEditor.svelte';
	import { ordersService } from '../ordersService';
	import { notifications } from '$lib/core/notifications/notificationStore';
	import type { SimplifiedOrder } from '../models/SimplifiedOrder';
	import { locationsService } from '../../locations/locationsService';
	import type { Location } from '../../locations/location';
	import { onMount } from 'svelte';

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

	onMount(async () => {
		locations = await locationsService.getLocations();
		loading = false;
	});

	function handleEdit() {
		editMode = true;
		originalOrder = order;
	}

	function handleCancel() {
		order = originalOrder;
		editMode = false;

		if (order.orderlines.every((line) => line.quantity === 0)) {
			handleDelete();
			return;
		}
	}

	async function handleSave() {
		if (order.orderlines.every((line) => line.quantity === 0)) {
			handleDelete();
			return;
		}

		try {
			const response = await ordersService.updateDay({
				kitchenId: order.kitchenId,
				date: order.date,
				desiredOrders: order.orderlines
			});
			if (response) onOrderChange?.(response);
			editMode = false;
		} catch (err) {
			notifications.error('Failed to save order');
		}
	}

	async function handleDelete() {
		try {
			await ordersService.updateDay({
				kitchenId: order.kitchenId,
				date: order.date,
				desiredOrders: []
			});
			onOrderCancel?.(order.date, order.kitchenId);
		} catch (err) {
			notifications.error('Failed to cancel order');
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
			<EditModeControls
				{isEditing}
				direction="row"
				locked={order.cancelEnabled === false}
				onEdit={handleEdit}
				onSave={handleSave}
				onCancel={handleCancel}
				onDelete={handleDelete}
			/>
		</div>
		<OrderEditor {order} {editMode} onOrderChange={(updatedOrder) => (order = updatedOrder)} />
	</Card>
{/if}
