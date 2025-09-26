<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { locationsService } from '../locationsService';
	import { onMount } from 'svelte';
	import type { Location } from '../location';
	import Label from '$lib/components/atoms/Label.svelte';
	import { slide } from 'svelte/transition';
	import Card from '$lib/components/atoms/Card.svelte';
	import type { Order } from '$lib/features/orders/models/order';
	import Button from '$lib/components/atoms/Button.svelte';
	import { format } from 'date-fns';

	type AddLocationCardProps = {
		locationsWithOrders: number[];
		newOrder?: (order: Order) => void;
	};

	let { newOrder = undefined, locationsWithOrders = [] }: AddLocationCardProps = $props();

	let allLocations = $state<Array<Location>>([]);
	let collapsed = $state(true);
	let loading = $state(true);

	onMount(async () => {
		allLocations = await locationsService.getLocations();
		loading = false;
	});

	let locations = $derived(
		allLocations.filter((loc) => !locationsWithOrders.includes(loc.kitchenId))
	);

	function handleLocationClick(loc: Location) {
		const order = scaffoldOrderForLocation(loc);
		newOrder?.(order);
	}

	function scaffoldOrderForLocation(loc: Location): Order {
		const date = format(new Date(), 'yyyy-MM-dd');
		return {
			date,
			kitchenId: loc.kitchenId,
			orderlines: [],
			cancelEnabled: true,
			kitchenName: loc.name
		};
	}
</script>

<div class="flex flex-col items-center w-full">
	<div class="flex flex-col items-center">
		<button
			class="flex flex-col items-center cursor-pointer select-none focus:outline-none"
			type="button"
			aria-expanded={!collapsed}
			aria-controls="todays-menu-content"
			onclick={() => (collapsed = !collapsed)}
		>
			<Label size="md" className="tracking-wide cursor-pointer">Tilføj Lokation</Label>
			<Icon name={collapsed ? 'open' : 'collapse'} size={16} />
		</button>
	</div>
	{#if !collapsed}
		<div transition:slide|local>
			<Card>
				{#if loading}
					<Label variant="muted">Indlæser lokationer...</Label>
				{:else if locations}
					{#if locations.length === 0}
						<Label variant="muted">Ingen lokationer fundet...</Label>
					{:else}
						<div class="flex flex-col space-y-2">
							{#each locations as loc}
								<Button variant="transparent" size="sm" onclick={() => handleLocationClick(loc)}>
									<Label size="xs" className="cursor-pointer capitalize tracking-wide"
										>{loc.name}</Label
									>
								</Button>
							{/each}
						</div>
					{/if}
				{/if}
			</Card>
		</div>
	{/if}
</div>
