<script lang="ts">
	import Label from '$lib/components/atoms/Label.svelte';
	import Card from '../../../components/atoms/Card.svelte';
	import EditModeControls from '../molecules/EditModeControls.svelte';
	import OrderEditor from '../molecules/OrderEditor.svelte';
	import { ordersService } from '../ordersService';
	import { notifications } from '$lib/core/notifications/notificationStore';
	import type { UpdateDayRequest } from '../models/updateDayRequest';
	import type { SimplifiedOrder } from '../models/SimplifiedOrder';

	type OrderCardProps = {
		order: SimplifiedOrder;
		onOrderChange?: (order: SimplifiedOrder | undefined) => void;
		isEditing?: boolean;
	};

	let { order, onOrderChange = undefined, isEditing = false }: OrderCardProps = $props();

	let originalOrder = $state(order);

	let editMode = $state(isEditing);
	function handleEdit() {
		editMode = true;
		originalOrder = order;
	}

	function handleCancel() {
		editMode = false;
		order = originalOrder;
	}

	async function handleSave() {
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
			const response = await ordersService.updateDay(req);
			notifications.success('Order updated successfully.');
			return response;
		} catch (err) {
			notifications.error('Failed to update order.');
		} finally {
			editMode = false;
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
