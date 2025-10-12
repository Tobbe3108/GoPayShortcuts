<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Label from '$lib/components/atoms/Label.svelte';
	import Card from '../../../components/atoms/Card.svelte';
	import EditModeControls from '../molecules/EditModeControls.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
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

	onMount(async () => {
		locations = await locationsService.getLocations();
		loading = false;
	});

	function handleEdit() {
		editMode = true;
		originalOrder = order;
	}

	function handleCancel() {
		// If this is a temp order (e.g. applied from default) or matches the saved default,
		// revert it to zero counts so the existing delete flow will remove it.
		const maybeTemplate = order as TemplateOrder;
		if (!maybeTemplate.tempOrder) {
			order = originalOrder;
			editMode = false;
			if (order.orderlines.every((line) => line.quantity === 0)) {
				handleDelete();
				return;
			}
			return;
		}

		// For temp/default orders: set all quantities to 0 and call delete
		order = {
			...order,
			orderlines: order.orderlines.map((l) => ({ ...l, quantity: 0 }))
		};
		editMode = false;
		handleDelete();
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
			// Show a notification with an actionable button to save this order as the global default
			notifications.success('Order saved', 5000, 'Save as default', async () => {
				try {
					await defaultStore.saveDefault(order);
					notifications.success('Default saved');
				} catch (err) {
					notifications.error('Failed to save default order');
					console.error('save default failed', err);
				}
			});
		} catch (err) {
			notifications.error('Failed to save order');
		}
	}

	async function handleSaveAsDefault() {
		try {
			await defaultStore.saveDefault(order);
			notifications.success('Default saved');
		} catch (err) {
			notifications.error('Failed to save default order');
			console.error('save default failed', err);
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
		<div transition:fade|local>
			<div class="flex flex-row items-center justify-between mb-2">
				<Label size="xl" className="capitalize tracking-wide">{kitchenName()}</Label>
				<div class="flex items-center gap-2">
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
			</div>
			<OrderEditor {order} {editMode} onOrderChange={(updatedOrder) => (order = updatedOrder)} />
		</div>
	</Card>
{/if}
