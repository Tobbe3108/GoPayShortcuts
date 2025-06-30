<script lang="ts">
	import type { DayOrderState, Location, OrderItemData } from '../types/orders';
	import { createEventDispatcher } from 'svelte';
	import LocationSelector from './LocationSelector.svelte';
	import { PRODUCT_IDS } from '$lib/constants/products';
	import { formatDay, formatDate, isPastDate } from '$lib/utils/dateUtils';
	import { notifications } from '$lib/stores/notificationStore';
	import AdditionalOrderButton from './AdditionalOrderButton.svelte';

	const {
		dayState,
		locations,
		onLocationChange: onLocationChangeProp
	} = $props<{
		dayState: DayOrderState;
		locations: Location[];
		onLocationChange: (date: Date, newLocation: Location | null) => void;
	}>();

	const dispatch = createEventDispatcher();
	const itemProductMap: Record<number, { name: string; type: 'breakfast' | 'lunch' | 'soda' }> = {
		[PRODUCT_IDS.BREAKFAST]: { name: 'Morgenmad', type: 'breakfast' },
		[PRODUCT_IDS.LUNCH]: { name: 'Frokost', type: 'lunch' },
		[PRODUCT_IDS.SODA]: { name: 'Læskedrik', type: 'soda' }
	};

	let isLoading = $state(false);
	let orderItems = $state<OrderItemData[]>(
		Object.entries(itemProductMap).map(([id, p]) => ({
			id: +id,
			name: p.name,
			quantity:
				p.type === 'breakfast'
					? dayState.breakfastQuantity
					: p.type === 'lunch'
						? dayState.lunchQuantity
						: p.type === 'soda'
							? dayState.sodaQuantity
							: 0,
			type: p.type as 'breakfast' | 'lunch' | 'soda'
		}))
	);

	let _currentDayOrderExistingId = $state(dayState.existingOrderId);
	let optimisticHasOrder = $derived(!!_currentDayOrderExistingId);

	$effect(() => {
		if (dayState.existingOrderId !== _currentDayOrderExistingId) {
			_currentDayOrderExistingId = dayState.existingOrderId;
			optimisticHasOrder = !!_currentDayOrderExistingId;
		}
	});

	function placeOrder() {
		if (!dayState.selectedLocation) {
			notifications.error('Vælg venligst en lokation for denne dag.');
			return;
		}
		if (orderItems.every((item) => item.quantity === 0)) {
			notifications.error('Kan ikke placere en tom bestilling.');
			return;
		}
		if (isPastDate(dayState.date)) {
			notifications.error('Du kan ikke placere bestillinger for en dag i fortiden.');
			return;
		}
		for (const item of orderItems) {
			if (
				(item.type === 'breakfast' || item.type === 'lunch') &&
				item.quantity > 0 &&
				!isOrderTimeAllowed(item.type, dayState.date)
			) {
				notifications.error(
					item.type === 'breakfast'
						? 'Du kan ikke bestille morgenmad mere i dag.'
						: 'Du kan ikke bestille frokost mere i dag.'
				);
				return;
			}
		}
		isLoading = true;
		optimisticHasOrder = true;
		setTimeout(() => {
			dispatch('orderPlaced', {
				date: dayState.date,
				items: orderItems.filter((i) => i.quantity > 0),
				location: dayState.selectedLocation
			});
			isLoading = false;
		}, 1000);
	}

	function saveAsDefault() {
		dispatch('saveDefault', {
			items: orderItems.map((item) => ({ ...item })),
			location: dayState.selectedLocation
		});
	}

	let previousBreakfastQty = dayState.breakfastQuantity;
	let previousLunchQty = dayState.lunchQuantity;
	let previousSodaQty = dayState.sodaQuantity;

	$effect(() => {
		const quantitiesChanged =
			dayState.breakfastQuantity !== previousBreakfastQty ||
			dayState.lunchQuantity !== previousLunchQty ||
			dayState.sodaQuantity !== previousSodaQty;
		if (dayState.existingOrderId !== _currentDayOrderExistingId) {
			if (optimisticHasOrder) {
				orderItems = Object.entries(itemProductMap).map(([id, p]) => {
					let qty =
						p.type === 'breakfast'
							? dayState.breakfastQuantity
							: p.type === 'lunch'
								? dayState.lunchQuantity
								: p.type === 'soda'
									? dayState.sodaQuantity
									: 0;
					return {
						id: +id,
						name: p.name,
						quantity: qty,
						type: p.type as 'breakfast' | 'lunch' | 'soda'
					};
				});
			}
		} else if (!optimisticHasOrder && quantitiesChanged) {
			orderItems = Object.entries(itemProductMap).map(([id, p]) => {
				let qty =
					p.type === 'breakfast'
						? dayState.breakfastQuantity
						: p.type === 'lunch'
							? dayState.lunchQuantity
							: p.type === 'soda'
								? dayState.sodaQuantity
								: 0;
				return {
					id: +id,
					name: p.name,
					quantity: qty,
					type: p.type as 'breakfast' | 'lunch' | 'soda'
				};
			});
		}
		previousBreakfastQty = dayState.breakfastQuantity;
		previousLunchQty = dayState.lunchQuantity;
		previousSodaQty = dayState.sodaQuantity;
	});

	function handleItemChange(itemId: number, change: number) {
		const idx = orderItems.findIndex((i) => i.id === itemId);
		if (idx !== -1) {
			const item = orderItems[idx];
			orderItems[idx] = { ...item, quantity: Math.max(0, item.quantity + change) };
		}
	}

	function handleLocationSelectedFromDropdown(newLocation: Location | null) {
		if (dayState && typeof dayState.date !== 'undefined' && onLocationChangeProp) {
			onLocationChangeProp(dayState.date, newLocation);
		}
	}

	const getTotalItems = () => orderItems.reduce((acc, item) => acc + item.quantity, 0);
	function isOrderTimeAllowed(itemType: 'breakfast' | 'lunch' | 'soda', date: Date): boolean {
		if (itemType === 'soda') return true;
		if (isPastDate(date)) return false;
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const orderDate = new Date(date);
		orderDate.setHours(0, 0, 0, 0);
		if (orderDate > today) return true;
		const hour = new Date().getHours();
		if (itemType === 'breakfast') return hour < 10;
		if (itemType === 'lunch') return hour < 13;
		return true;
	}
</script>

<div
	class="bg-white shadow rounded-lg p-4 flex flex-col gap-4 border border-slate-200 {dayState.isWeekend
		? 'opacity-70 bg-slate-50'
		: ''} {dayState.isToday ? 'border-slate-800 border-2' : ''}"
>
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-semibold text-slate-800">{formatDay(dayState.date)}</h3>
		<span class="text-sm text-slate-500">{formatDate(dayState.date)}</span>
	</div>

	{#if isPastDate(dayState.date) && !optimisticHasOrder}
		<p class="italic text-center text-slate-600">
			Bestillinger kan ikke placeres for fortidige dage.
		</p>
	{:else if optimisticHasOrder}
		<div class="p-3 border border-slate-300 rounded bg-slate-50 flex flex-col gap-2">
			<h4 class="font-semibold text-slate-700 text-md">Bestillingsoversigt:</h4>
			{#if dayState.orderDetails?.distinctLocations && dayState.orderDetails.distinctLocations.length > 1}
				<div class="text-sm text-slate-600">
					<strong>Lokationer:</strong>
					<div class="mt-1 flex flex-col gap-1">
						{#each dayState.orderDetails.distinctLocations as location}
							<div class="flex items-center">
								<span class="inline-block w-2 h-2 mr-2 bg-slate-500 rounded-full"></span>
								{location.name}
							</div>
						{/each}
					</div>
				</div>
			{:else if dayState.selectedLocation}
				<p class="text-sm text-slate-600">
					<strong>Lokation:</strong>
					{dayState.selectedLocation.name}
				</p>
			{/if}
			<ul class="pl-0 flex flex-col gap-1">
				{#if dayState.existingOrderId && dayState.orderDetails?.orderLines?.length > 0}
					{#each dayState.orderDetails.orderLines as line (line.id)}
						<li class="flex justify-between text-slate-700">
							<span>{line.name}</span>
							<span>Antal: {line.items}</span>
						</li>
					{/each}
				{:else}
					{#each orderItems.filter((item) => item.quantity > 0) as item (item.id)}
						<li class="flex justify-between text-slate-700">
							<span>{item.name}</span>
							<span>Antal: {item.quantity}</span>
						</li>
					{/each}
					{#if orderItems.filter((item) => item.quantity > 0).length === 0 && !isLoading}
						<li class="text-sm italic text-slate-500">Ingen varer i denne bestilling.</li>
					{/if}
				{/if}
			</ul>
			{#if dayState.orderDetails?.price}
				<p class="font-medium text-right text-slate-700 border-t border-slate-200 mt-2">
					Totalpris: {dayState.orderDetails.price.formatted}
				</p>
			{/if}
		</div>
		<div class="flex flex-col gap-2 pt-2">
			{#if !isPastDate(dayState.date)}
				<AdditionalOrderButton {dayState} on:additionalOrderPlaced />
			{/if}
			<button
				onclick={saveAsDefault}
				disabled={isLoading}
				class="w-full px-4 py-2 font-bold text-white bg-slate-600 rounded hover:bg-slate-500 disabled:opacity-50 disabled:bg-gray-400"
				>Gem som standard</button
			>
		</div>
	{:else}
		<LocationSelector
			selectedLocation={dayState.selectedLocation}
			{locations}
			onLocationChange={handleLocationSelectedFromDropdown}
		/>
		<div class="flex flex-col gap-2">
			{#each orderItems as item (item.id)}
				<div class="flex items-center justify-between">
					<span class="text-slate-700">{item.name}</span>
					<div class="flex items-center gap-2">
						<button
							onclick={() => handleItemChange(item.id, -1)}
							disabled={isLoading || item.quantity === 0}
							class="px-2 py-1 font-bold text-slate-700 bg-slate-200 rounded-l hover:bg-slate-300 disabled:opacity-50"
							>-</button
						>
						<span class="w-8 text-center text-slate-700">{item.quantity}</span>
						<button
							onclick={() => handleItemChange(item.id, 1)}
							disabled={isLoading || !isOrderTimeAllowed(item.type, dayState.date)}
							class="px-2 py-1 font-bold text-slate-700 bg-slate-200 rounded-r hover:bg-slate-300 disabled:opacity-50"
							>+</button
						>
					</div>
				</div>
			{/each}
		</div>
		<div class="flex flex-col gap-2 pt-2">
			<button
				onclick={placeOrder}
				class:opacity-50={isLoading}
				disabled={isLoading ||
					getTotalItems() === 0 ||
					!dayState.selectedLocation ||
					isPastDate(dayState.date)}
				class="w-full px-4 py-2 font-bold text-white bg-slate-800 rounded hover:bg-slate-700 disabled:bg-gray-400"
				>{#if isLoading}Placerer bestilling...{:else}Placér bestilling{/if}</button
			>
		</div>
	{/if}
</div>
