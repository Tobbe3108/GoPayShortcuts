<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { locationsService } from '../locationsService';
	import { onMount } from 'svelte';
	import type { Location } from '../location';
	import Label from '$lib/components/atoms/Label.svelte';
	import { slide } from 'svelte/transition';
	import Card from '$lib/components/atoms/Card.svelte';

	let locations = $state<Array<Location>>([]);
	let collapsed = $state(true);
	let loading = $state(true);

	onMount(async () => {
		locations = await locationsService.getLocations();
		loading = false;
	});
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
			<Label size="md" className="tracking-wide cursor-pointer">Lokationer</Label>
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
						<div class="space-y-2">
							{#each locations as loc}
								<div>
									<Label>{loc.name}</Label>
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</Card>
		</div>
	{/if}
</div>
