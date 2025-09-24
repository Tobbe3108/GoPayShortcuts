<script lang="ts">
	import type { Order } from '$lib/features/orders/models/order';
	import FormField from '$lib/components/molecules/FormField.svelte';
	import OrderEditor from '$lib/features/orders/molecules/OrderEditor.svelte';
	import EditModeControls from '$lib/features/orders/molecules/EditModeControls.svelte';
	import Label from '$lib/components/atoms/Label.svelte';

	let inputValue = $state('');

	let order: Order = $state({
		date: new Date().toISOString(),
		kitchenId: 123,
		orderlines: [{ productId: 1, quantity: 2, price: 50 }],
		cancelEnabled: true,
		id: 123,
		kitchenName: 'Test Kitchen',
		status: 'pending',
		totalPrice: 200
	});

	let lastAction = $state('');
</script>

<main class="p-6 space-y-6">
	<div class="mb-4 flex gap-4">
		<a href="/debug/atoms" class="text-blue-600 hover:underline">Atoms Debug</a>
		<a href="/debug/molecules" class="text-blue-900 font-bold underline">Molecules Debug</a>
		<a href="/debug/organisms" class="text-blue-600 hover:underline">Organisms Debug</a>
		<a href="/debug" class="text-blue-600 hover:underline">Main Debug</a>
	</div>
	<h1 class="text-2xl font-bold">Molecules Debug Page</h1>

	<section>
		<FormField
			label="FormField Test"
			placeholder="Type here..."
			onInput={(e: string) => (inputValue = e)}
		/>
		<Label variant="muted">Input: {inputValue}</Label>
	</section>

	<section>
		<Label variant="default">OrderEditor Demo</Label>
		<div class="flex space-x-4">
			<OrderEditor {order} onOrderChange={(updatedOrder) => (order = updatedOrder)} />
			<OrderEditor
				{order}
				editMode={true}
				onOrderChange={(updatedOrder) => (order = updatedOrder)}
			/>
		</div>
	</section>

	<div>
		<Label variant="default">EditModeControls Demo</Label>
		<EditModeControls
			direction="row"
			onSave={() => (lastAction = 'Save')}
			onCancel={() => (lastAction = 'Cancel')}
			onDelete={() => (lastAction = 'Delete')}
		/>
		<EditModeControls
			direction="column"
			onSave={() => (lastAction = 'Save')}
			onCancel={() => (lastAction = 'Cancel')}
			onDelete={() => (lastAction = 'Delete')}
		/>
		<EditModeControls direction="row" locked={true} />
		<Label variant="muted">Last action: {lastAction}</Label>
	</div>
</main>
