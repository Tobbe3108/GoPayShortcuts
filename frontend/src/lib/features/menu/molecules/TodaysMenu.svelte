<script lang="ts">
	import { menuService } from '$lib/features/menu/menuService';
	import type { MenuItem } from '$lib/features/menu/models/menuItem';
	import type { MenuDay } from '$lib/features/menu/models/menuDay';
	import Card from '$lib/components/atoms/Card.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import { onMount } from 'svelte';
	import { capitalize } from '$lib/core/utils/stringUtils';

	let { date }: { date: Date } = $props();

	let menuItems = $state<MenuItem[] | undefined>(undefined);
	let loading = $state(true);

	onMount(async () => {
		const menuDays: MenuDay[] = await menuService.getMenu();
		const todayISO = getISO(date);
		const todayMenu = menuDays.find((day) => day.date === todayISO);
		menuItems = todayMenu?.items;
		loading = false;
	});

	function getISO(date: Date): string {
		const today = new Date();
		return today.toISOString().slice(0, 10);
	}

	function groupByCategory(items: MenuItem[]): Record<string, MenuItem[]> {
		const grouped: Record<string, MenuItem[]> = {};
		for (const item of items) {
			const cat = item.category || 'Ukendt kategori';
			if (!grouped[cat]) grouped[cat] = [];
			grouped[cat].push(item);
		}
		return grouped;
	}
</script>

<div class="flex flex-wrap">
	<Card>
		{#if loading}
			<Label variant="muted">Indlæser menu...</Label>
		{:else if menuItems}
			{#if menuItems.length === 0}
				<Label variant="muted">Ingen menu tilgængelig for i dag...</Label>
			{:else}
				<div class="flex flex-col space-y-4">
					{#each Object.entries(groupByCategory(menuItems)) as [category, items]}
						<div>
							<Label size="lg">{category}</Label>
							{#each items as item}
								<div class="flex items-center">
									<Label>{item.name}</Label>
									<!-- TODO: Change datastructure of returned menu in backend - Split on the first - and add the stuff after on a new line in a smaller label -->
									{#if item.allergens && item.allergens.length}
										<div class="group ml-5">
											<Label size="xs" variant="muted">Allergener</Label>
											<Label
												size="xs"
												variant="muted"
												className="absolute hidden group-hover:block"
											>
												{capitalize(item.allergens.join(', '))}
											</Label>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</Card>
</div>
