<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { DayOrderState, Location, OrderItemData } from '../types/orders';
	import { PRODUCT_IDS } from '$lib/constants/products';
	import { isPastDate, isOrderTimeAllowed } from '$lib/utils/dateUtils';
	import { notifications } from '$lib/stores/notificationStore';
	import orderStore from '$lib/stores/orderStore';
	import LocationSelector from './LocationSelector.svelte';

	const { dayState } = $props<{
		dayState: DayOrderState;
	}>();

	const dispatch = createEventDispatcher();

	// Define itemProductMap
	const itemProductMap: Record<number, { name: string; type: 'breakfast' | 'lunch' | 'soda' }> = {
		[PRODUCT_IDS.BREAKFAST]: { name: 'Morgenmad', type: 'breakfast' },
		[PRODUCT_IDS.LUNCH]: { name: 'Frokost', type: 'lunch' },
		[PRODUCT_IDS.SODA]: { name: 'Læskedrik', type: 'soda' }
	};
	// State for the modal
	let isModalOpen = $state(false);
	let isLoading = $state(false);
	let selectedLocation = $state<Location | null>(dayState.selectedLocation || null);

	// Initialize order items with zero quantities
	let orderItems = $state<OrderItemData[]>(
		Object.entries(itemProductMap).map(([idStr, productDetails]) => ({
			id: parseInt(idStr),
			name: productDetails.name,
			quantity: 0,
			type: productDetails.type
		}))
	);
	function openModal() {
		// Reset quantities when opening modal
		orderItems = Object.entries(itemProductMap).map(([idStr, productDetails]) => ({
			id: parseInt(idStr),
			name: productDetails.name,
			quantity: 0,
			type: productDetails.type
		}));
		// Initialize with the current dayState location but allow user to change it
		selectedLocation = dayState.selectedLocation || null;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	function handleItemChange(itemId: number, change: number) {
		const itemIndex = orderItems.findIndex((i) => i.id === itemId);
		if (itemIndex !== -1) {
			const itemToChange = orderItems[itemIndex];
			const newQuantity = Math.max(0, itemToChange.quantity + change);
			orderItems[itemIndex] = { ...itemToChange, quantity: newQuantity };
		}
	}
	function placeAdditionalOrder() {
		if (!selectedLocation) {
			notifications.error('Lokation skal være valgt for denne dag.');
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

		// Validate order time constraints
		for (const item of orderItems) {
			if (
				item.type === 'breakfast' &&
				item.quantity > 0 &&
				!isOrderTimeAllowed(item.type, dayState.date)
			) {
				notifications.error('Du kan ikke bestille morgenmad mere i dag.');
				return;
			}
			if (
				item.type === 'lunch' &&
				item.quantity > 0 &&
				!isOrderTimeAllowed(item.type, dayState.date)
			) {
				notifications.error('Du kan ikke bestille frokost mere i dag.');
				return;
			}
		}
		isLoading = true;
		setTimeout(() => {
			// Get complete location data from the store based on kitchenId
			let locationData = selectedLocation;
			console.log('Initial location data:', locationData);
			console.log('Available locations in store:', $orderStore.locations); // Try to find the complete location data in the store if webshopId is missing
			if (locationData && locationData.kitchenId) {
				// Always try to get a fresh copy from the store to ensure complete data
				console.log('Searching for complete location with kitchenId:', locationData.kitchenId);
				const completeLocation = $orderStore.locations.find(
					(loc) => loc.kitchenId === locationData.kitchenId
				);

				if (completeLocation) {
					console.log('Found complete location:', completeLocation);
					locationData = completeLocation;
				}
			}
			let data = {
				date: dayState.date,
				items: orderItems.filter((i) => i.quantity > 0),
				location: locationData,
				isAdditional: true
			};
			console.log('Placing additional order with data:', data);
			dispatch('additionalOrderPlaced', data);
			isLoading = false;
			closeModal();
		}, 1000);
	}

	function handleLocationChange(newLocation: Location | null) {
		selectedLocation = newLocation;
	}

	function getTotalItems() {
		return orderItems.reduce((acc, item) => acc + item.quantity, 0);
	}
</script>

<button
	onclick={openModal}
	class="w-full px-4 py-2 mt-2 font-bold text-white transition-opacity duration-150 ease-in-out bg-green-600 rounded hover:bg-green-700"
>
	Tilføj ekstra bestilling
</button>

{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl">
			<div class="flex justify-between mb-4">
				<h3 class="text-xl font-semibold text-slate-800">Tilføj ekstra bestilling</h3>
				<button onclick={closeModal} class="text-gray-500 hover:text-gray-700">✕</button>
			</div>
			<div class="mb-4">
				<p class="block mb-2 text-sm font-medium text-slate-700">Lokation</p>
				<LocationSelector
					{selectedLocation}
					locations={$orderStore.locations}
					onLocationChange={handleLocationChange}
				/>
			</div>

			<div class="p-3 space-y-3 flex-1 flex flex-col">
				{#each orderItems as item (item.id)}
					<div class="flex items-center justify-between">
						<span class="text-slate-700">{item.name}</span>
						<div class="flex items-center space-x-2">
							<button
								onclick={() => handleItemChange(item.id, -1)}
								disabled={isLoading || item.quantity === 0}
								class="px-2 py-1 font-bold text-slate-700 transition-colors bg-slate-200 rounded-l hover:bg-slate-300 disabled:opacity-50"
							>
								-
							</button>
							<span class="w-8 text-center text-slate-700">{item.quantity}</span>
							<button
								onclick={() => handleItemChange(item.id, 1)}
								disabled={isLoading || !isOrderTimeAllowed(item.type, dayState.date)}
								class="px-2 py-1 font-bold text-slate-700 transition-colors bg-slate-200 rounded-r hover:bg-slate-300 disabled:opacity-50"
							>
								+
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="flex space-x-2">
				<button
					onclick={closeModal}
					disabled={isLoading}
					class="w-1/2 px-4 py-2 font-bold text-white transition-colors bg-slate-500 rounded hover:bg-slate-600 disabled:opacity-50"
				>
					Annuller
				</button>
				<button
					onclick={placeAdditionalOrder}
					disabled={isLoading || getTotalItems() === 0 || !selectedLocation}
					class="w-1/2 px-4 py-2 font-bold text-white transition-opacity duration-150 ease-in-out bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:bg-gray-400"
				>
					{#if isLoading}Placerer bestilling...{:else}Placér bestilling{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
