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
		const today = new Date(date);
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
				<div class="space-y-4">
					{#each Object.entries(groupByCategory(menuItems)) as [category, items]}
						<div class="space-y-1">
							<Label size="lg">{category}</Label>
							{#each items as item}
								<div class="flex flex-row flex-wrap items-center gap-4">
									<div class="flex flex-col">
										<Label>{item.item}</Label>
										{#if item.subItems && item.subItems.length}
											<Label size="sm" variant="muted">{capitalize(item.subItems.join(', '))}</Label
											>
										{/if}
									</div>
									{#if item.allergens && item.allergens.length}
										<div class="row-span-2 group shrink">
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
