<script lang="ts">
	import Label from '$lib/components/atoms/Label.svelte';
	import Card from '../../../components/atoms/Card.svelte';
	import EditModeControls from '../molecules/EditModeControls.svelte';
	import OrderEditor from '../molecules/OrderEditor.svelte';
	import { ordersService } from '../ordersService';
	import { notifications } from '$lib/core/notifications/notificationStore';
	import type { SimplifiedOrder } from '../models/SimplifiedOrder';

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
</script>

<Card>
	<div class="flex flex-row items-center justify-between mb-2">
		<Label size="xl" className="capitalize tracking-wide">{order.kitchenId}</Label>
		<!-- TODO: Use location service to get kitchen name -->
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
