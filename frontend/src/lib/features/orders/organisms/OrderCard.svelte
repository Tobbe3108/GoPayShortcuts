<script lang="ts">
	import Label from '$lib/components/atoms/Label.svelte';
	import Card from '../../../components/atoms/Card.svelte';
	import type { Order } from '../models/order';
	import EditModeControls from '../molecules/EditModeControls.svelte';
	import OrderEditor from '../molecules/OrderEditor.svelte';

	type OrderCardProps = {
		order: Order;
	};

	let { order }: OrderCardProps = $props();

	let originalOrder = $state<Order | undefined>(undefined);

	let editMode = $state(false);
	function handleEdit() {
		editMode = true;
		originalOrder = order;
	}

	function handleSave() {
		// TODO:
		editMode = false;
	}

	function handleCancel() {
		editMode = false;
		if (originalOrder) order = originalOrder;
	}

	function handleDelete() {
		// TODO:
		editMode = false;
	}
</script>

<Card>
	<div class="flex flex-row items-center justify-between">
		<Label className="font-semibold">{order.kitchenName}</Label>
		<EditModeControls
			direction="row"
			locked={order.cancelEnabled === false}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
			onDelete={handleDelete}
		/>
	</div>
	<OrderEditor {order} {editMode} />
</Card>
