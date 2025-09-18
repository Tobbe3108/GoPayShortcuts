<script lang="ts">
	import FormField from '$lib/components/molecules/FormField.svelte';
	import ProductQuantitySelector from '$lib/components/molecules/ProductQuantitySelector.svelte';

	let quantity = 1;
</script>

<main class="p-6 space-y-6">
	<h1 class="text-2xl font-bold">Molecules Debug Page</h1>
	<section>
		<FormField label="FormField Test" placeholder="Type here..." />
	</section>

	<section>
		<ProductQuantitySelector
			label="Quantity"
			value={quantity}
			min={0}
			max={10}
			onChange={(v: number) => (quantity = v)}
		/>
	</section>
</main>
