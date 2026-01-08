<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { locationsService } from '../locationsService';
	import { onMount } from 'svelte';
	import type { Location } from '../location';
	import Label from '$lib/components/atoms/Label.svelte';
	import { slide } from 'svelte/transition';
	import Card from '$lib/components/atoms/Card.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import { format } from 'date-fns';
	import type { SimplifiedOrder } from '$lib/features/orders/models/SimplifiedOrder';
	import { _ } from 'svelte-i18n';
	import { useFlickGesture } from '$lib/core/gestures/gestureDetector';

	type AddLocationCardProps = {
		locationsWithOrders: number[];
		newOrder?: (order: SimplifiedOrder) => void;
		date: Date;
		// When true, expand the card. When false/undefined, let component manage its own state
		expandOnFlick?: boolean;
	};

	let { date, newOrder = undefined, locationsWithOrders = [], expandOnFlick }: AddLocationCardProps =
		$props();

	let allLocations = $state<Array<Location>>([]);
	let collapsed = $state(true);
	let loading = $state(true);

	onMount(async () => {
		await locationsService
			.getLocations()
			.then((result) => (allLocations = result))
			.finally(() => (loading = false));
	});

	let locations = $derived(
		allLocations.filter((loc) => !locationsWithOrders.includes(loc.kitchenId))
	);

	// When parent signals a flick, expand the card
	$effect(() => {
		if (expandOnFlick === true) {
			collapsed = false;
		}
	});

	function handleLocationClick(loc: Location) {
		const order = scaffoldOrderForLocation(loc);
		newOrder?.(order);
		collapsed = true;
	}

	function scaffoldOrderForLocation(loc: Location): SimplifiedOrder {
		return {
			date: format(date, 'yyyy-MM-dd'),
			kitchenId: loc.kitchenId,
			orderlines: [],
			cancelEnabled: true
		};
	}

	// Handle flick-down gesture when directly flicking on the card button
	function handleFlickDown() {
		collapsed = false;
	}
</script>

<div class="flex flex-col items-center w-full" use:useFlickGesture={{ onFlickDown: handleFlickDown }}>
	<div class="flex flex-col items-center">
		<button
			class="flex flex-col items-center cursor-pointer select-none focus:outline-none pointer-events-auto"
			type="button"
			aria-expanded={!collapsed}
			aria-controls="todays-menu-content"
			onclick={() => (collapsed = !collapsed)}
		>
			<Label size="md" className="tracking-wide cursor-pointer">{$_('locations.add')}</Label>
			<Icon name={collapsed ? 'open' : 'collapse'} size={16} />
		</button>
	</div>
	{#if !collapsed}
		<div transition:slide|local class="w-full">
			{#if !loading}
				<Card>
					{#if !locations || locations.length === 0}
						<Label variant="muted">{$_('locations.noneFound')}</Label>
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
				</Card>
			{/if}
		</div>
	{/if}
</div>
