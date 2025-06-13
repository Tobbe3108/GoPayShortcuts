<script lang="ts">
	import DayCard from '$lib/components/DayCard.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { locationService, orderService, localStorageService } from '$lib/services/orderService';
	import type { Location, OrderItemData, OrderLine } from '../lib/types/orders';
	import orderStore from '$lib/stores/orderStore';
	import authStore from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { PRODUCT_IDS } from '$lib/constants/products';
	import { base } from '$app/paths';
	import {
		isSameDate,
		isWeekend,
		createOrderDate,
		formatISODateWithOffset
	} from '$lib/utils/dateUtils';
	import { page } from '$app/stores';
	import { notifications } from '$lib/stores/notificationStore';
	import { writable } from 'svelte/store';
	import { getISOWeek } from 'date-fns';

	const MONDAY_INDEX = 1;
	const itemProductMap: Record<number, { name: string; type: 'breakfast' | 'lunch' | 'soda' }> = {
		[PRODUCT_IDS.BREAKFAST]: { name: 'Morgenmad', type: 'breakfast' },
		[PRODUCT_IDS.LUNCH]: { name: 'Frokost', type: 'lunch' },
		[PRODUCT_IDS.SODA]: { name: 'Sodavand', type: 'soda' }
	};

	const today = new Date();
	const initialWeekStart = getStartOfWeek(today);
	const selectedWeekStart = writable<Date>(initialWeekStart);

	$effect(() => {
		if (!$authStore.user) {
			console.debug('User is not authenticated, redirecting to login');
			goto(base + '/login');
		} else {
			const unsub = selectedWeekStart.subscribe(() => {
				loadInitialData();
			});
			return unsub;
		}
	});

	function getStartOfWeek(date: Date): Date {
		const d = new Date(date);
		const day = d.getDay();
		const diff = d.getDate() - day + (day === 0 ? -6 : MONDAY_INDEX);
		d.setHours(0, 0, 0, 0);
		return new Date(d.setDate(diff));
	}

	function getWorkdays(startOfWeek: Date): Date[] {
		const workdays: Date[] = [];
		for (let i = 0; i < 5; i++) {
			const day = new Date(startOfWeek);
			day.setDate(startOfWeek.getDate() + i);
			workdays.push(day);
		}
		return workdays;
	}

	function getWeekLabel(date: Date) {
		const week = getISOWeek(date);
		return `Uge ${week}`;
	}

	async function loadInitialData() {
		$orderStore.isLoading = true;
		$orderStore.errorMessage = null;
		try {
			const fetchedLocations = await locationService.getLocations();
			$orderStore.locations = fetchedLocations;

			const defaultOrderPref = localStorageService.getDefaultOrder();
			let initialSelectedLocation: Location | undefined = undefined;
			if (defaultOrderPref && defaultOrderPref.location?.kitchenId) {
				// Match by kitchenId for robustness
				const validDefaultLocation = fetchedLocations.find(
					(l) => l.kitchenId === defaultOrderPref.location?.kitchenId
				);
				if (validDefaultLocation) {
					initialSelectedLocation = validDefaultLocation;
				}
			}
			// Removed automatic fallback to first location when no default is set
			// This ensures a location is only used if explicitly selected by the user or saved as default

			let startOfWeekValue = getStartOfWeek(today);
			selectedWeekStart.subscribe((val) => {
				startOfWeekValue = val;
			})();
			const startOfWeek = startOfWeekValue;
			const fetchedOrders = await orderService.getOrdersForWeek(startOfWeek);
			const workdaysDates = getWorkdays(startOfWeek);
			const newWeekDays = workdaysDates.map((date) => {
				const existingOrder = fetchedOrders.find((o) => isSameDate(new Date(o.deliveryTime), date));

				let dayLocationToSet: Location | undefined;
				let breakfastQty = 0;
				let lunchQty = 0;
				let sodaQty = 0;
				let orderDetails = undefined;
				if (existingOrder) {
					// Get delivery location from existing order, but ensure it has a valid webshopId
					// The API sometimes returns locations without a webshopId, which breaks additional orders
					if (existingOrder.deliveryLocation) {
						if (!existingOrder.deliveryLocation.webshopId) {
							// Try to find a matching location with complete data
							const matchingLocation = fetchedLocations.find(
								(l) => l.kitchenId === existingOrder.deliveryLocation.kitchenId
							);

							if (matchingLocation) {
								// Use the complete location data with webshopId
								dayLocationToSet = matchingLocation;
							} else {
								// Fall back to the original location if no match found
								dayLocationToSet = existingOrder.deliveryLocation;
							}
						} else {
							// Use the original location if it already has a webshopId
							dayLocationToSet = existingOrder.deliveryLocation;
						}
					}

					// Extract order details for display
					if (existingOrder.orderDetails) {
						const orderLines = [];
						let cancelDisabled = false;

						if (existingOrder.orderDetails.deliveries && existingOrder.orderDetails.deliveries[0]) {
							// Check if cancel is disabled
							const delivery = existingOrder.orderDetails.deliveries[0];

							// Cancel is disabled if cancelEnable is explicitly false OR if cancelOrder.cancelEnable is explicitly false
							if (delivery.cancelOrder?.cancelEnable === false) {
								cancelDisabled = true;
							}

							// Process order lines if available
							if (delivery.orderLines) {
								orderLines.push(
									...delivery.orderLines.map((line) => ({
										id: line.id,
										name: line.name,
										items: line.items
									}))
								);
							}
						}
						orderDetails = {
							orderLines,
							price: existingOrder.orderDetails.price
								? {
										amount: existingOrder.orderDetails.price.amount,
										formatted: existingOrder.orderDetails.price.formatted
									}
								: undefined,
							cancelDisabled
						};
					}

					existingOrder.orderLines.forEach((line: OrderLine) => {
						const productInfo = itemProductMap[line.productId];
						if (productInfo) {
							if (productInfo.type === 'breakfast') breakfastQty = line.items;
							else if (productInfo.type === 'lunch') lunchQty = line.items;
							else if (productInfo.type === 'soda') sodaQty = line.items;
						}
					});
				} else {
					// No existing order, apply defaults
					if (defaultOrderPref) {
						defaultOrderPref.items.forEach((item) => {
							if (item.type === 'breakfast') breakfastQty = item.quantity;
							if (item.type === 'lunch') lunchQty = item.quantity;
							if (item.type === 'soda') sodaQty = item.quantity;
						});
						if (defaultOrderPref.location) {
							// Match by ID for robustness
							const validDefaultLoc = fetchedLocations.find(
								(l) => l.kitchenId === defaultOrderPref.location?.kitchenId
							);
							if (validDefaultLoc) {
								dayLocationToSet = validDefaultLoc;
							}
						}
					}
				} // No longer applying fallback location automatically
				// Each day will have undefined location unless explicitly set by existing order or user default
				const isToday = isSameDate(date, new Date());

				return {
					date,
					selectedLocation: dayLocationToSet,
					breakfastQuantity: breakfastQty,
					lunchQuantity: lunchQty,
					sodaQuantity: sodaQty,
					isSaving: false,
					saveError: null,
					existingOrderId: existingOrder?.id,
					isWeekend: isWeekend(date),
					isToday,
					orderDetails
				};
			});
			$orderStore.weekDays = newWeekDays;
			$orderStore.isLoading = false;
		} catch (err: any) {
			console.error('Error loading initial data:', err);
			$orderStore.isLoading = false;
			$orderStore.errorMessage = err.message || 'Failed to load order data.';
		}
	}

	function handleLocationChangeInPage(date: Date, newLocation: Location | null) {
		// Allow newLocation to be undefined
		// const { date, newLocation } = event.detail; // Removed event destructuring
		$orderStore.weekDays = $orderStore.weekDays.map((day) => {
			if (isSameDate(day.date, date)) {
				// Preserve existing quantities when changing location
				return {
					...day,
					selectedLocation: newLocation // This can be undefined
					// breakfastQuantity, lunchQuantity, and sodaQuantity are preserved
				};
			}
			return day;
		});
	}
	async function handleOrderUpdate(
		event: CustomEvent<{
			date: Date;
			items: OrderItemData[];
			location: Location;
			isAdditional?: boolean;
		}>
	) {
		const { date, items, isAdditional = false } = event.detail;
		let { location } = event.detail; // Use let for location so we can modify it
		const dayStateToUpdate = $orderStore.weekDays.find((d) => isSameDate(d.date, date));
		if (!dayStateToUpdate) return;

		$orderStore.weekDays = $orderStore.weekDays.map((day) =>
			isSameDate(day.date, date) ? { ...day, isSaving: true, saveError: null } : day
		);

		try {
			const orderLinesPayload: OrderLine[] = items
				.filter((item) => item.quantity > 0)
				.map((item) => ({ productId: item.id, items: item.quantity, buyerParty: 'PRIVATE' }));

			// For additional orders, try to find a complete location with webshopId if missing
			if (isAdditional && location && (!location.webshopId || location.webshopId === '')) {
				console.log('Additional order missing webshopId, searching for complete location');
				const completeLocation = $orderStore.locations.find(
					(loc) => loc.kitchenId === location.kitchenId
				);

				if (completeLocation && completeLocation.webshopId) {
					console.log('Found complete location for additional order:', completeLocation);
					location = completeLocation;
				}
			}

			if (!location || !location.kitchenId || !location.webshopId) {
				console.error('Invalid location data:', location);
				throw new Error('Lokation skal vælges.');
			}

			if (orderLinesPayload.length > 0) {
				// If this is an additional order, don't cancel the existing one
				if (dayStateToUpdate.existingOrderId && !isAdditional) {
					await orderService.cancelOrder(dayStateToUpdate.existingOrderId);
				}

				// Place the order using the appropriate method
				if (isAdditional) {
					await orderService.placeAdditionalOrder({
						deliveryTime: formatISODateWithOffset(date),
						deliveryLocation: location,
						orderLines: orderLinesPayload
					});
					notifications.success('Ekstra bestilling blev placeret med succes!');
				} else {
					await orderService.placeOrder({
						deliveryTime: formatISODateWithOffset(date),
						deliveryLocation: location,
						orderLines: orderLinesPayload
					});
					notifications.success('Bestilling blev placeret med succes!');
				}
			} else if (dayStateToUpdate.existingOrderId && !isAdditional) {
				await orderService.cancelOrder(dayStateToUpdate.existingOrderId);
				notifications.success('Bestilling blev annulleret med succes!');
			}
			await loadInitialData();
		} catch (err: any) {
			console.error('Error updating order:', err);
			notifications.error(err.message || 'Fejl ved opdatering af bestilling.');
			$orderStore.weekDays = $orderStore.weekDays.map((day) =>
				isSameDate(day.date, date)
					? { ...day, isSaving: false, saveError: err.message || 'Failed to save order.' }
					: day
			);
			$orderStore.errorMessage = err.message || 'Failed to save order.';
		}
	}

	async function handleOrderCancelled(event: CustomEvent<{ date: Date }>) {
		const { date } = event.detail;
		const dayStateToUpdate = $orderStore.weekDays.find((d) => isSameDate(d.date, date));
		if (dayStateToUpdate && dayStateToUpdate.existingOrderId) {
			$orderStore.weekDays = $orderStore.weekDays.map((day) =>
				isSameDate(day.date, date) ? { ...day, isSaving: true, saveError: null } : day
			);
			try {
				await orderService.cancelOrder(dayStateToUpdate.existingOrderId);
				notifications.success('Bestilling blev annulleret med succes!');
				await loadInitialData();
			} catch (err: any) {
				console.error('Error cancelling order:', err);
				notifications.error(err.message || 'Fejl ved annullering af bestilling.');
				$orderStore.weekDays = $orderStore.weekDays.map((day) =>
					isSameDate(day.date, date)
						? { ...day, isSaving: false, saveError: err.message || 'Failed to cancel order.' }
						: day
				);
				$orderStore.errorMessage = err.message || 'Failed to cancel order.';
			}
		}
	}

	function handleSaveDefault(
		event: CustomEvent<{ items: OrderItemData[]; location: Location | undefined }>
	) {
		// Allow location to be undefined
		const { items, location } = event.detail;
		localStorageService.saveDefaultOrder(items, location); // Update all applicable day cards with the new default, including location
		$orderStore.weekDays = $orderStore.weekDays.map((day) => {
			// Only update if no order exists for the day and it's not a weekend
			if (!day.existingOrderId && !day.isWeekend) {
				return {
					...day,
					selectedLocation: location, // Apply new default location (can be undefined)
					breakfastQuantity: items.find((i) => i.type === 'breakfast')?.quantity ?? 0, // Use ?? 0 to handle undefined quantity
					lunchQuantity: items.find((i) => i.type === 'lunch')?.quantity ?? 0,
					sodaQuantity: items.find((i) => i.type === 'soda')?.quantity ?? 0
				};
			}
			return day;
		});

		// Use the notification system instead of orderStore.successMessage
		notifications.success('Standardbestillingsindstillinger gemt!');
	}
</script>

<div class="container p-4 mx-auto">
	<div class="container mx-auto flex items-center justify-between mb-8">
		<img src="{base}/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-28 w-auto" />
		{#if $orderStore.weekDays.length > 0}
			<div class="text-slate-700 font-bold text-2xl">{getWeekLabel($selectedWeekStart)}</div>
		{/if}
		{#if $authStore.user && $page.url.pathname !== '/login'}
			<button
				onclick={() => {
					$authStore.user = null;
					$authStore.loading = false;
					$authStore.error = null;
					localStorage.removeItem('food_shortcuts_auth');
					goto(base + '/login');
				}}
				class="px-4 py-2 font-semibold text-white transition duration-150 ease-in-out bg-slate-800 rounded-lg shadow hover:bg-slate-700"
			>
				Log ud
			</button>
		{/if}
	</div>

	{#if $orderStore.isLoading && $orderStore.weekDays.length === 0}
		<div class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
			<LoadingSpinner size="w-12 h-12" />
			<p class="mt-4 text-slate-600">Indlæser bestillinger...</p>
		</div>
	{:else if $orderStore.weekDays.length > 0}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			{#each $orderStore.weekDays as dayState, i (dayState.date.toISOString())}
				<DayCard
					{dayState}
					locations={$orderStore.locations}
					onLocationChange={handleLocationChangeInPage}
					on:orderPlaced={handleOrderUpdate}
					on:additionalOrderPlaced={handleOrderUpdate}
					on:orderCancelled={handleOrderCancelled}
					on:saveDefault={handleSaveDefault}
				/>
			{/each}
		</div>
		<div class="flex flex-col items-center gap-2 mt-8">
			<div class="flex gap-4">
				<button
					class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
					onclick={() =>
						selectedWeekStart.update((d) => {
							const nd = new Date(d);
							nd.setDate(nd.getDate() - 7);
							return getStartOfWeek(nd);
						})}
				>
					Forrige uge
				</button>
				<button
					class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
					disabled={isSameDate($selectedWeekStart, getStartOfWeek(today))}
					onclick={() => selectedWeekStart.set(getStartOfWeek(today))}
				>
					Denne uge
				</button>
				<button
					class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
					onclick={() =>
						selectedWeekStart.update((d) => {
							const nd = new Date(d);
							nd.setDate(nd.getDate() + 7);
							return getStartOfWeek(nd);
						})}
				>
					Næste uge
				</button>
			</div>
		</div>
	{:else if !$orderStore.isLoading}
		<p class="mt-10 text-center text-slate-500">Ingen bestillingsdata tilgængelig for denne uge.</p>
	{/if}
</div>
