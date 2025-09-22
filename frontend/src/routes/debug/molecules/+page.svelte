<script lang="ts">
	import type { Order } from '$lib/features/orders/models/order';
	import FormField from '$lib/components/molecules/FormField.svelte';
	import ProductQuantitySelector from '$lib/features/products/molecules/ProductQuantitySelector.svelte';
	import OrderSummary from '$lib/features/orders/molecules/OrderSummary.svelte';
	import EditModeControls from '$lib/features/orders/molecules/EditModeControls.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import type { Product } from '$lib/features/products/product';

	let inputValue = '';

	let quantity = 1;

	const order: Order = {
		date: new Date().toISOString(),
		kitchenId: 123,
		orderlines: [
			{ productId: 1, quantity: 2, price: 50 },
			{ productId: 2, quantity: 1, price: 100 }
		],
		cancelEnabled: true,
		id: 123,
		kitchenName: 'Test Kitchen',
		status: 'pending',
		totalPrice: 200
	};

	const product: Product = { id: 1, name: 'Sample Product', price: 100 };

	let lastAction = '';
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
		<ProductQuantitySelector
			{product}
			value={quantity}
			min={0}
			max={10}
			onChange={(v: number) => (quantity = v)}
		/>
		<Label variant="muted">Quantity: {quantity}</Label>
	</section>

	<section>
		<Label variant="default">OrderSummary Demo</Label>
		<OrderSummary {order} />
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
