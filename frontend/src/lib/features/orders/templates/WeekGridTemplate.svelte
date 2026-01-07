<script lang="ts">
	import DayHeader from '$lib/components/molecules/DayHeader.svelte';
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import TodaysMenu from '$lib/features/menu/molecules/TodaysMenu.svelte';
	import { _ } from 'svelte-i18n';
	import { startOfWeek, endOfWeek, addDays, isPast, isToday, isFuture, format } from 'date-fns';
	import {
		listOrders,
		ordersByDay,
		handleOrderChange,
		handleCancel,
		updateOrderForKitchen,
		toRecord,
		type TemplateOrder
	} from '$lib/features/orders/orderUtils';
	import Card from '$lib/components/atoms/Card.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';
	import { fade } from 'svelte/transition';
	import defaultStore from '$lib/features/orders/defaultStore';
	import { notifications } from '$lib/core/notifications/notificationStore';
	import { ordersService } from '$lib/features/orders/ordersService';

	type WeekGridProps = {
		date: Date;
	};

	let { date }: WeekGridProps = $props();

	let weekStart = $derived(startOfWeek(date, { weekStartsOn: 1 }));
	let weekEnd = $derived(endOfWeek(date, { weekStartsOn: 1 }));
	let weekDates = $derived(Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)));

	let loading = $state(true);
	let orders: Record<string, TemplateOrder[]> = $state({});
	let hasDefaultOrder = $state(false);

	$effect(() => {
		defaultStore.getDefault().then((def) => {
			hasDefaultOrder = def !== null;
		});
	});

	// In-memory prefetch cache keyed by week range (non-reactive to avoid re-run loops)
	let prefetchCache: Record<string, Record<string, TemplateOrder[]>> = {};
	const keyForRange = (start: Date, end: Date) =>
		`${format(start, 'yyyy-MM-dd')}__${format(end, 'yyyy-MM-dd')}`;

	$effect(() => {
		// If we have prefetched data, use it immediately
		const currentKey = keyForRange(weekStart, weekEnd);
		if (prefetchCache[currentKey]) {
			orders = prefetchCache[currentKey];
			loading = false;
		}

		// Primary fetch for the visible week (refresh to ensure freshness)
		listOrders(weekStart, weekEnd)
			.then((listed) => (orders = listed))
			.finally(() => {
				loading = false;
				// After navigation and refresh, wipe prefetch cache to avoid staleness
				prefetchCache = {};
			});

		// Fire-and-forget: prefetch next week and store it for instant navigation
		const nextStart = addDays(weekStart, 7);
		const nextEnd = addDays(weekEnd, 7);
		const nextKey = keyForRange(nextStart, nextEnd);
		listOrders(nextStart, nextEnd)
			.then((nextOrders) => {
				prefetchCache[nextKey] = nextOrders;
			})
			.catch(() => {});

		// Fire-and-forget: prefetch previous week and store it for instant navigation
		const prevStart = addDays(weekStart, -7);
		const prevEnd = addDays(weekEnd, -7);
		const prevKey = keyForRange(prevStart, prevEnd);
		listOrders(prevStart, prevEnd)
			.then((prevOrders) => {
				prefetchCache[prevKey] = prevOrders;
			})
			.catch(() => {});
	});
</script>

<div class="grid grid-cols-5 gap-4">
	{#each weekDates as date}
		<div class="flex flex-col gap-4">
			<div class="space-y-4">
				<DayHeader {date} />
				<TodaysMenu {date} />
			</div>
			{#if !loading}
				{#key format(weekStart, 'yyyy-MM-dd')}
					<div in:fade class="space-y-4">
						{#if isPast(date) && !isToday(date) && ordersByDay(orders, date).length === 0}
							<Card>
								<div class="text-xs text-gray-400 text-center">
									{$_('orders.cannotPlaceOrdersPast')}
								</div>
							</Card>
						{/if}

						{#if (isToday(date) || isFuture(date)) && ordersByDay(orders, date).length === 0}
							<Card>
								{#if hasDefaultOrder}
									<div class="flex justify-center">
										<Button
											variant="transparent"
											size="sm"
											ariaLabel={$_('orders.useDefaultOrder')}
											onclick={async () => {
												const def = await defaultStore.getDefault();
												if (!def) {
													notifications.info($_('orders.noSavedDefaultOrder'));
													return;
												}
												const cloned = {
													...def,
													date: format(date, 'yyyy-MM-dd'),
													tempOrder: true
												};
												updateOrderForKitchen(orders, cloned);
											}}
										>
											<div class="text-xs text-gray-400 text-center">
												{$_('orders.useDefaultOrder')}
											</div>
										</Button>
									</div>
								{:else}
									<div class="text-xs text-gray-400 text-center">
										{$_('orders.saveAsDefaultHint')}
									</div>
								{/if}
							</Card>
						{/if}

						{#each ordersByDay(orders, date) as order (order.kitchenId)}
							<OrderCard
								{order}
								isEditing={order.tempOrder}
								onOrderChange={(newOrderState) => handleOrderChange(orders, newOrderState)}
								onOrderCancel={(date, kitchenId) => handleCancel(orders, date, kitchenId)}
							/>
						{/each}

						{#if isToday(date) || isFuture(date)}
							<AddLocationCard
								{date}
								newOrder={(newOrder) =>
									updateOrderForKitchen(orders, { ...newOrder, tempOrder: true })}
								locationsWithOrders={[...ordersByDay(orders, date)].map((o) => o.kitchenId)}
							/>
						{/if}
					</div>
				{/key}
			{/if}
		</div>
	{/each}
</div>
