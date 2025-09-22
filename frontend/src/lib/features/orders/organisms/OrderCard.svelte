<script lang="ts">
	import Card from '../../../components/atoms/Card.svelte';
	type OrderCardProps = {
		locked: boolean;
	};

	let { locked = false }: OrderCardProps = $props();
</script>

<Card>
	{#if locked == false}
		<EditModeControls />
	{/if}
	<OrderSummary />
</Card>
