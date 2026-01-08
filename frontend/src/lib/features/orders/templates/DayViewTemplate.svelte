<script lang="ts">
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import TodaysMenu from '$lib/features/menu/molecules/TodaysMenu.svelte';
	import { _ } from 'svelte-i18n';
	import { endOfWeek, isPast, isToday, startOfWeek, isFuture, format, addDays } from 'date-fns';
	import { fade } from 'svelte/transition';
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
	import defaultStore from '$lib/features/orders/defaultStore';
	import { notifications } from '$lib/core/notifications/notificationStore';
	import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';
	import { ordersService } from '$lib/features/orders/ordersService';
	import { useSwipeGesture, useFlickGesture } from '$lib/core/gestures/gestureDetector';

	type DayViewProps = {
		date: Date;
		onDateChange?: (newDate: Date) => void;
	};

	let { date, onDateChange }: DayViewProps = $props();

	let selectedDate = $derived(date);
	let weekStart = $derived(startOfWeek(selectedDate, { weekStartsOn: 1 }));
	let weekEnd = $derived(endOfWeek(selectedDate, { weekStartsOn: 1 }));

	let loading = $state(true);
	let orders: Record<string, TemplateOrder[]> = $state({});
	let hasDefaultOrder = $state(false);
	let expandMenusOnFlick = $state(false);
	let gestureOverlay: HTMLElement | undefined = $state();

	// Toggle pointer-events during touch to allow button clicks
	const handleGestureOverlayTouchStart = () => {
		if (gestureOverlay) {
			gestureOverlay.style.pointerEvents = 'auto';
		}
	};

	const handleGestureOverlayTouchEnd = () => {
		if (gestureOverlay) {
			gestureOverlay.style.pointerEvents = 'none';
		}
	};

	// Swipe navigation handlers - dispatch events to parent component
	const handleSwipeLeft = () => {
		const newDate = addDays(selectedDate, 1);
		onDateChange?.(newDate);
	};

	const handleSwipeRight = () => {
		const newDate = addDays(selectedDate, -1);
		onDateChange?.(newDate);
	};

	// Flick gesture handler - toggles menu expansion when flicking on whitespace
	// The flick gesture will be applied to the transparent overlay, which covers whitespace areas
	const handleFlickDown = () => {
		expandMenusOnFlick = !expandMenusOnFlick;
	};

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
		// If we have prefetched data for the containing week, use it immediately
		const currentKey = keyForRange(weekStart, weekEnd);
		if (prefetchCache[currentKey]) {
			orders = prefetchCache[currentKey];
			loading = false;
		}

		// Primary fetch for the visible week (containing selectedDate)
		listOrders(weekStart, weekEnd)
			.then((listed) => {
				orders = listed;
			})
			.finally(() => {
				loading = false;
				// After navigation and refresh, wipe prefetch cache to avoid staleness
				prefetchCache = {};
			});

		// Fire-and-forget: prefetch next week and store it
		const nextStart = addDays(weekStart, 7);
		const nextEnd = addDays(weekEnd, 7);
		const nextKey = keyForRange(nextStart, nextEnd);
		ordersService
			.listOrders(nextStart, nextEnd)
			.then((arr) => {
				prefetchCache[nextKey] = toRecord(arr);
			})
			.catch(() => {});

		// Fire-and-forget: prefetch previous week and store it
		const prevStart = addDays(weekStart, -7);
		const prevEnd = addDays(weekEnd, -7);
		const prevKey = keyForRange(prevStart, prevEnd);
		ordersService
			.listOrders(prevStart, prevEnd)
			.then((arr) => {
				prefetchCache[prevKey] = toRecord(arr);
			})
			.catch(() => {});
	});
</script>

<div class="relative w-full min-h-screen">
	<!-- Transparent gesture overlay: captures swipe and flick on whitespace -->
	<!-- Positioned absolutely to cover the entire viewport -->
	<!-- pointer-events: none by default allows clicks to pass through to buttons -->
	<!-- Enabled only during touch events to capture gestures without blocking clicks -->
	<!-- z-index is carefully positioned to be above the background but below interactive content -->
	<div
		bind:this={gestureOverlay}
		class="fixed inset-0 z-10"
		style="background-color: transparent; pointer-events: none;"
		ontouchstart={handleGestureOverlayTouchStart}
		ontouchend={handleGestureOverlayTouchEnd}
		use:useSwipeGesture={{ onSwipeLeft: handleSwipeLeft, onSwipeRight: handleSwipeRight }}
		use:useFlickGesture={{ onFlickDown: handleFlickDown }}
	/>

	<!-- Main content grid - below overlay in terms of pointer events but visible -->
	<div class="grid grid-cols-1 gap-4 relative z-20">
		<TodaysMenu date={selectedDate} expandOnFlick={expandMenusOnFlick} />
		{#if !loading}
			{#key format(selectedDate, 'yyyy-MM-dd')}
				<div in:fade class="flex flex-col space-y-4 w-full">
					{#if isPast(selectedDate) && !isToday(selectedDate) && [...ordersByDay(orders, selectedDate)].length === 0}
						<Card>
							<div class="text-xs text-gray-400 text-center">
								{$_('orders.cannotPlaceOrdersPast')}
							</div>
						</Card>
					{/if}

					{#if (isToday(selectedDate) || isFuture(selectedDate)) && [...ordersByDay(orders, selectedDate)].length === 0}
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
												date: format(selectedDate, 'yyyy-MM-dd'),
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

					{#each ordersByDay(orders, selectedDate) as order (order.kitchenId)}
						<OrderCard
							{order}
							isEditing={order.tempOrder}
							onOrderChange={(newOrderState) => handleOrderChange(orders, newOrderState)}
							onOrderCancel={(selectedDate, kitchenId) =>
								handleCancel(orders, selectedDate, kitchenId)}
						/>
					{/each}

					{#if isToday(date) || isFuture(date)}
						<AddLocationCard
							date={selectedDate}
							newOrder={(newOrder) => updateOrderForKitchen(orders, { ...newOrder, tempOrder: true })}
							locationsWithOrders={[...ordersByDay(orders, selectedDate)].map((o) => o.kitchenId)}
							expandOnFlick={expandMenusOnFlick}
						/>
					{/if}
				</div>
			{/key}
		{/if}
	</div>
</div>
