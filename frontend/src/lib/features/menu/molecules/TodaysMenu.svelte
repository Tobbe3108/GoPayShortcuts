<script lang="ts">
	import { menuService } from '$lib/features/menu/menuService';
	import type { MenuItem } from '$lib/features/menu/models/menuItem';
	import type { MenuDay } from '$lib/features/menu/models/menuDay';
	import Card from '$lib/components/atoms/Card.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import { slide, fade } from 'svelte/transition';
	import { format } from 'date-fns';
	import { t } from '$lib/core/i18n';

	let { date }: { date: Date } = $props();

	let menuDays = $state<MenuDay[]>([]);
	let menuItems = $state<MenuItem[] | undefined>(undefined);
	let loading = $state(true);
	let collapsed = $state(true);

	onMount(async () => {
		await menuService
			.getMenu()
			.then((res) => (menuDays = res))
			.finally(() => (loading = false));
	});

	$effect(() => {
		const todayISO = format(date, 'yyyy-MM-dd');
		const todayMenu = menuDays.find((day) => day.date === todayISO);
		menuItems = todayMenu?.items;
	});

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
	<div class="flex flex-col items-center">
		<button
			class="flex flex-col items-center cursor-pointer select-none focus:outline-none"
			type="button"
			aria-expanded={!collapsed}
			aria-controls="todays-menu-content"
			onclick={() => (collapsed = !collapsed)}
		>
			<Label size="md" className="tracking-wide cursor-pointer">{t('menu.todaysMenu')}</Label>
			<Icon name={collapsed ? 'open' : 'collapse'} size={16} />
		</button>
	</div>

	{#if !collapsed}
		<div transition:slide|local id="todays-menu-content" class="w-full mt-2">
			{#if !loading}
			<Card className="p-3">
				{#if !menuItems}
					<Label variant="muted" size="sm">{t('menu.noMenu')}</Label>
					{:else}
						<div class="flex flex-col gap-2">
							{#each Object.entries(groupByCategory(menuItems)) as [category, items]}
								<div>
									<Label size="sm" className="tracking-wide font-semibold">{category}</Label>
									<ul class="mt-1">
										{#each items as item}
											<li class="flex items-start gap-2 text-sm">
												<div class="flex-1">
													<div class="flex items-baseline gap-2">
														<Label size="sm">{item.item}</Label>
														{#if item.subItems && item.subItems.length}
															<Label size="xs" variant="muted" className="italic capitalize"
																>{item.subItems.join(', ')}</Label
															>
														{/if}
													</div>
													{#if item.allergens && item.allergens.length}
														<span
															class="ml-auto relative group align-middle inline-flex items-center mb-3 mt-1"
														>
														<button
															class="inline-block px-1 py-0.5 text-[10px] leading-tight bg-gray-100 rounded cursor-pointer select-none focus:outline-sky-500 focus-visible:outline-2"
															aria-haspopup="dialog"
															aria-expanded="false"
															aria-label={t('menu.allergenLabel')}
															tabindex="0"
														>
															{t('menu.allergens')}
														</button>
															<div
																role="dialog"
																aria-hidden="true"
																class="absolute right-0 top-full mt-1 w-max max-w-xs px-2 py-1 rounded capitalize bg-white border border-gray-200 shadow opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-150 text-xs"
															>
																{item.allergens.join(', ')}
															</div>
														</span>
													{/if}
												</div>
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>
					{/if}
				</Card>
			{/if}
		</div>
	{/if}
</div>
