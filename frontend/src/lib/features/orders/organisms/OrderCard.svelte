<script lang="ts">
	import Label from '$lib/components/atoms/Label.svelte';
	import Card from '../../../components/atoms/Card.svelte';
	import type { Order } from '../models/order';
	import EditModeControls from '../molecules/EditModeControls.svelte';
	import OrderEditor from '../molecules/OrderEditor.svelte';
	import { ordersService } from '../ordersService';
	import { notifications } from '$lib/core/notifications/notificationStore';
	import type { UpdateDayRequest } from '../models/update/updateDayRequest';

	type OrderCardProps = {
		order: Order;
		onOrderChange?: (order: Order | undefined) => void;
	};

	let { order, onOrderChange = undefined }: OrderCardProps = $props();

	let originalOrder = $state(order);

	let editMode = $state(false);
	function handleEdit() {
		editMode = true;
		originalOrder = order;
	}

	function handleCancel() {
		editMode = false;
		order = originalOrder;
		onOrderChange?.(order);
	}

	async function handleSave() {
		//TODO: Do nothing if order is the same

		if (order.orderlines.every((line) => line.quantity === 0)) {
			handleDelete();
			return;
		}

		await handleUpdate({
			kitchenId: order.kitchenId,
			date: order.date,
			desiredOrders: order.orderlines
		});
		onOrderChange?.(order);
	}

	async function handleDelete() {
		try {
			await handleUpdate({
				kitchenId: order.kitchenId,
				date: order.date,
				desiredOrders: []
			});
			onOrderChange?.(undefined);
		} catch (_) {}
	}

	async function handleUpdate(req: UpdateDayRequest) {
		try {
			await ordersService.updateDay(req);
			notifications.success('Order updated successfully.');
		} catch (err) {
			notifications.error('Failed to update order.');
		} finally {
			editMode = false;
		}
	}
</script>

<Card>
	<div class="flex flex-row items-center justify-between mb-2">
		<Label size="xl" className="font-semibold">{order.kitchenName}</Label>
		<EditModeControls
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
