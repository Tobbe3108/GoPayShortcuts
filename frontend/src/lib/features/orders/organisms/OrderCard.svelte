<script lang="ts">
	import Card from '../../../components/atoms/Card.svelte';
	import type { Order } from '../models/order';
	import EditModeControls from '../molecules/EditModeControls.svelte';
	import OrderEditor from '../molecules/OrderEditor.svelte';

	type OrderCardProps = {
		order: Order;
	};

	let { order }: OrderCardProps = $props();

	let editMode = $state(false);
	function handleEdit() {
		editMode = true;
	}

	function handleAction() {
		editMode = false;
	}
</script>

<Card>
	<EditModeControls
		direction="row"
		locked={order.cancelEnabled === false}
		onEdit={handleEdit}
		onSave={handleAction}
		onCancel={handleAction}
		onDelete={handleAction}
	/>
	<div class="flex justify-between items-center mb-4">
		<OrderEditor {order} {editMode} />
	</div>
</Card>
