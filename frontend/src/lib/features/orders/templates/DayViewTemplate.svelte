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

	type DayViewProps = {
		date: Date;
		prevDay?: () => void;
		nextDay?: () => void;
	};

	let { date, prevDay = undefined, nextDay = undefined }: DayViewProps = $props();

	let selectedDate = $derived(date);
	let weekStart = $derived(startOfWeek(selectedDate, { weekStartsOn: 1 }));
	let weekEnd = $derived(endOfWeek(selectedDate, { weekStartsOn: 1 }));

	let loading = $state(true);
	let orders: Record<string, TemplateOrder[]> = $state({});
	let hasDefaultOrder = $state(false);

	// Global collapsed states for swipe gestures
	let menuCollapsed = $state(true);
	let locationCollapsed = $state(true);

	// Swipe gesture handling
	let touchStartX = $state(0);
	let touchStartY = $state(0);
	let touchStartTime = $state(0);
	let isSwiping = $state(false);

	function handleTouchStart(event: TouchEvent) {
		console.log('Touch start:', event.touches[0].clientX, event.touches[0].clientY);
		event.preventDefault(); // Prevent page scrolling during swipe gestures
		const touch = event.touches[0];
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
		touchStartTime = Date.now();
		isSwiping = false;
	}

	function handleTouchMove(event: TouchEvent) {
		console.log('Touch move:', event.touches[0].clientX, event.touches[0].clientY, 'isSwiping:', isSwiping);
		if (isSwiping) {
			// Prevent default scrolling during active swipe
			event.preventDefault();
			return;
		}

		const touch = event.touches[0];
		const deltaX = Math.abs(touch.clientX - touchStartX);
		const deltaY = Math.abs(touch.clientY - touchStartY);

		// Start swiping if movement is significant
		if (deltaX > 10 || deltaY > 10) {
			console.log('Starting swipe detection, deltaX:', deltaX, 'deltaY:', deltaY);
			isSwiping = true;
			event.preventDefault(); // Prevent scrolling once swipe is detected
		}
	}

	function handleTouchEnd(event: TouchEvent) {
		console.log('Touch end:', event.changedTouches[0].clientX, event.changedTouches[0].clientY, 'isSwiping:', isSwiping);
		event.preventDefault(); // Prevent any default touch end behavior

		if (!isSwiping) {
			console.log('Not swiping, ignoring touch end');
			return;
		}

		const touch = event.changedTouches[0];
		const deltaX = touch.clientX - touchStartX;
		const deltaY = touch.clientY - touchStartY;
		const deltaTime = Date.now() - touchStartTime;

		console.log('Swipe analysis - deltaX:', deltaX, 'deltaY:', deltaY, 'deltaTime:', deltaTime);

		// Only handle gestures that are fast enough and significant enough
		const minDistance = 50;
		const maxTime = 500;

		if (deltaTime > maxTime) {
			console.log('Swipe too slow, ignoring');
			isSwiping = false;
			return;
		}

		// Horizontal swipe for day navigation (left/right)
		if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
			console.log('Horizontal swipe detected');
			if (deltaX > 0 && nextDay) {
				console.log('Swipe right - next day');
				nextDay();
			} else if (deltaX < 0 && prevDay) {
				console.log('Swipe left - previous day');
				prevDay();
			}
		}
		// Vertical swipe down to open menu and collapse locations
		else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > minDistance) {
			console.log('Vertical swipe down detected - opening menu');
			menuCollapsed = false;
			locationCollapsed = true;
		} else {
			console.log('Swipe detected but not significant enough or wrong direction');
		}

		isSwiping = false;
	}

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

<div
	class="grid grid-cols-1 gap-4"
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
>
	<TodaysMenu
		date={selectedDate}
		collapsed={menuCollapsed}
		onCollapsedChange={(newCollapsed) => menuCollapsed = newCollapsed}
	/>
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
						collapsed={locationCollapsed}
						onCollapsedChange={(newCollapsed) => locationCollapsed = newCollapsed}
					/>
				{/if}
			</div>
		{/key}
	{/if}
</div>
