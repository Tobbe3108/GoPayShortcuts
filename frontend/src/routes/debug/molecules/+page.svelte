<script lang="ts">
	import FormField from '$lib/components/molecules/FormField.svelte';
	import ProductQuantitySelector from '$lib/components/molecules/ProductQuantitySelector.svelte';
	import LocationSelector from '$lib/components/molecules/LocationSelector.svelte';
	import OrderSummary from '$lib/components/molecules/OrderSummary.svelte';
	import EditModeControls from '$lib/components/molecules/EditModeControls.svelte';
	import Label from '$lib/components/atoms/Label.svelte';

	let inputValue = '';

	let quantity = 1;
	const locations = [
		{ id: 'canteen1', name: 'Canteen 1' },
		{ id: 'canteen2', name: 'Canteen 2' },
		{ id: 'canteen3', name: 'Canteen 3' }
	];

	let selectedLocation: string | number | undefined = undefined;

	const orderItems = [
		{ id: 'breakfast', name: 'Breakfast', quantity: 2, price: 17 },
		{ id: 'lunch', name: 'Lunch', quantity: 1, price: 15 },
		{ id: 'soda', name: 'Soda', quantity: 3, price: 5 }
	];

	let lastAction = '';
</script>

<main class="p-6 space-y-6">
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
			label="ProductQuantitySelector Demo"
			value={quantity}
			min={0}
			max={10}
			onChange={(v: number) => (quantity = v)}
		/>
		<Label variant="muted">Quantity: {quantity}</Label>
	</section>

	<section>
		<LocationSelector
			label="LocationSelector Demo"
			{locations}
			selectedId={selectedLocation}
			onChange={(id: string | number) => (selectedLocation = id)}
		/>
		<Label variant="muted">Location: {selectedLocation}</Label>
	</section>

	<section>
		<Label variant="default">OrderSummary Demo</Label>
		<OrderSummary items={orderItems} />
	</section>

	<section>
		<Label variant="default">EditModeControls Demo</Label>
		<EditModeControls
			direction="row"
			onSave={() => (lastAction = 'Save')}
			onCancel={() => (lastAction = 'Cancel')}
			onDelete={() => (lastAction = 'Delete')}
		/>
		<Label variant="muted">Last action: {lastAction}</Label>
	</section>
</main>
