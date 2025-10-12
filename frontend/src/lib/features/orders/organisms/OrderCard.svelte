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
		if (order.orderlines.every((line) => line.quantity === 0)) {
			handleDelete();
			return;
		}

		const response = await ordersService.updateDay({
			kitchenId: order.kitchenId,
			date: order.date,
			desiredOrders: order.orderlines
		});
		if (response) onOrderChange?.(response);
		editMode = false;
		notifications.info(undefined, 2500, 'Save as default?', async () => handleSaveAsDefault());
	}

	async function handleSaveAsDefault() {
		try {
			await defaultStore.saveDefault(order);
		} catch (err) {
			notifications.error('Failed to save default order');
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
