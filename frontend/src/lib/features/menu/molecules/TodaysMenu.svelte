<script lang="ts">
	import { menuService } from '$lib/features/menu/menuService';
	import type { MenuItem } from '$lib/features/menu/models/menuItem';
	import type { MenuDay } from '$lib/features/menu/models/menuDay';
	import Card from '$lib/components/atoms/Card.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import { onMount } from 'svelte';

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

<div class="flex flex-col items-center w-full">
	<Card>
		{#if loading}
			<div class="flex justify-center py-8">
				<Label variant="muted">Indlæser menu...</Label>
			</div>
		{:else if menuItems}
			{#if menuItems.length === 0}
				<div class="flex justify-center py-8">
					<Label variant="muted">Ingen menu tilgængelig for i dag...</Label>
				</div>
			{:else}
				<div>
					{#each Object.entries(groupByCategory(menuItems)) as [category, items]}
						<div class="mb-2">
							<Label size="xs" className="font-semibold uppercase tracking-wide">{category}</Label>
							<ul>
								{#each items as item}
									<li class="flex items-center text-sm py-1 px-0.5 gap-2">
										<Label size="sm">{item.item}</Label>
										{#if item.subItems && item.subItems.length}
											<Label size="sm" variant="muted" className="italic capitalize"
												>{item.subItems.join(', ')}</Label
											>
										{/if}
										{#if item.allergens && item.allergens.length}
											<span
												class="ml-auto relative group align-middle flex items-center justify-end min-w-[80px]"
											>
												<Label
													size="xs"
													variant="muted"
													className="inline-block px-1.5 py-0.5 text-[10px] leading-tight bg-gray-100 text-gray-500 rounded font-medium cursor-pointer select-none group-hover:bg-gray-200 group-focus-within:bg-gray-200 transition"
												>
													Allergener
												</Label>
												<Label
													size="xs"
													variant="default"
													className="absolute right-0 top-full z-10 mt-1 w-max rounded bg-white border border-gray-200 shadow px-2 py-1 text-xs text-gray-700 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-150 capitalize"
												>
													{item.allergens.join(', ')}
												</Label>
											</span>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</Card>
</div>
