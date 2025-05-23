<script lang="ts">
    import DayCard from "$lib/components/DayCard.svelte";
    import LocationSelector from "$lib/components/LocationSelector.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import { locationService, orderService, localStorageService } from "$lib/services/orderService";
    import type { DayOrderState, Location, Order, OrderItemData, Kitchen, OrderLine } from "../lib/types/orders";
    import { onMount } from "svelte";

    let weekDays: DayOrderState[] = [];
    let locations: Location[] = [];
    let selectedLocationState: Location | undefined = undefined;
    let isLoading = true;
    let errorMessage: string | null = null;

    const MONDAY_INDEX = 1;

    const itemProductMap: Record<number, { name: string, type: 'breakfast' | 'lunch' | 'soda' }> = {
        1: { name: "Breakfast", type: "breakfast" },
        2: { name: "Lunch", type: "lunch" },
        3: { name: "Soda", type: "soda" },
    };

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

    async function loadInitialData() {
        isLoading = true;
        errorMessage = null;
        try {
            const fetchedLocations = await locationService.getLocations();
            locations = fetchedLocations;

            const defaultOrderPref = localStorageService.getDefaultOrder();
            let initialSelectedLocation: Location | undefined = undefined;

            if (defaultOrderPref && defaultOrderPref.location) {
                const validDefaultLocation = locations.find(l =>
                    l.name === defaultOrderPref.location.name &&
                    l.kitchen.id === defaultOrderPref.location.kitchen.id
                );
                if (validDefaultLocation) {
                    initialSelectedLocation = validDefaultLocation;
                }
            }

            if (!initialSelectedLocation && locations.length > 0) {
                initialSelectedLocation = locations[0];
            }
            selectedLocationState = initialSelectedLocation;

            const startOfWeek = getStartOfWeek(new Date());
            const fetchedOrders = await orderService.getOrdersForWeek(startOfWeek);
            const workdaysDates = getWorkdays(startOfWeek);

            weekDays = workdaysDates.map(date => {
                const existingOrder = fetchedOrders.find(
                    o => new Date(o.deliveryTime).toDateString() === date.toDateString()
                );

                let dayLocation: Location | undefined = initialSelectedLocation;
                let dayKitchen: Kitchen | undefined = initialSelectedLocation?.kitchen;
                let breakfastQty = 0;
                let lunchQty = 0;
                let sodaQty = 0;

                if (existingOrder) {
                    dayLocation = existingOrder.deliveryLocation;
                    dayKitchen = existingOrder.kitchen;
                    existingOrder.orderLines.forEach((line: OrderLine) => {
                        const productInfo = itemProductMap[line.productId];
                        if (productInfo) {
                            if (productInfo.type === 'breakfast') breakfastQty = line.items;
                            else if (productInfo.type === 'lunch') lunchQty = line.items;
                            else if (productInfo.type === 'soda') sodaQty = line.items;
                        }
                    });
                } else if (defaultOrderPref) {
                    if (initialSelectedLocation && defaultOrderPref.location.name === initialSelectedLocation.name) {
                        dayLocation = initialSelectedLocation;
                        dayKitchen = initialSelectedLocation.kitchen;
                    }
                    defaultOrderPref.items.forEach(item => {
                        if (item.type === 'breakfast') breakfastQty = item.quantity;
                        if (item.type === 'lunch') lunchQty = item.quantity;
                        if (item.type === 'soda') sodaQty = item.quantity;
                    });
                }

                if (!dayLocation && locations.length > 0) {
                    dayLocation = locations[0];
                    dayKitchen = locations[0].kitchen;
                }

                if (!dayLocation || !dayKitchen) {
                    console.warn("DayCard is being created without a fully defined location/kitchen for date:", date.toDateString());
                    if (locations.length > 0 && !dayLocation) {
                        dayLocation = locations[0];
                        dayKitchen = locations[0].kitchen;
                    }
                }

                return {
                    date,
                    hasOrder: !!existingOrder,
                    order: existingOrder,
                    location: dayLocation!,
                    kitchen: dayKitchen!,
                    breakfast: breakfastQty,
                    lunch: lunchQty,
                    soda: sodaQty,
                };
            });

        } catch (error) {
            console.error("Error loading initial data:", error);
            errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        loadInitialData();
    });

    function handleLocationChange(event: CustomEvent<Location>) {
        const newSelectedLocation = event.detail;
        selectedLocationState = newSelectedLocation;
        const defaultOrderPref = localStorageService.getDefaultOrder();

        weekDays = weekDays.map(day => {
            if (!day.hasOrder && newSelectedLocation) {
                let breakfastQty = 0;
                let lunchQty = 0;
                let sodaQty = 0;

                if (defaultOrderPref && defaultOrderPref.location.name === newSelectedLocation.name && defaultOrderPref.location.kitchen.id === newSelectedLocation.kitchen.id) {
                    defaultOrderPref.items.forEach(item => {
                        if (item.type === 'breakfast') breakfastQty = item.quantity;
                        if (item.type === 'lunch') lunchQty = item.quantity;
                        if (item.type === 'soda') sodaQty = item.quantity;
                    });
                } else {
                    breakfastQty = 0;
                    lunchQty = 0;
                    sodaQty = 0;
                }

                return {
                    ...day,
                    location: newSelectedLocation,
                    kitchen: newSelectedLocation.kitchen,
                    breakfast: breakfastQty,
                    lunch: lunchQty,
                    soda: sodaQty
                };
            }
            return day;
        });
    }

    async function handleOrderPlaced(event: CustomEvent<{ date: Date; items: OrderItemData[] }>) {
        if (!selectedLocationState) {
            errorMessage = "Please select a delivery location first.";
            return;
        }
        const { date, items } = event.detail;
        const orderLines = items
            .filter(item => item.quantity > 0)
            .map(item => ({ productId: item.id, items: item.quantity, buyerParty: "PRIVATE" as const }));

        if (orderLines.length === 0) {
            errorMessage = "Cannot place an empty order.";
            return;
        }

        const targetDayState = weekDays.find(d => d.date.toDateString() === date.toDateString());
        if (!targetDayState) {
            errorMessage = "Could not find the day to place the order for.";
            return;
        }

        isLoading = true;
        errorMessage = null;
        try {
            await orderService.placeOrder({
                deliveryTime: date.toISOString(),
                deliveryLocation: targetDayState.location,
                orderLines,
                kitchen: targetDayState.kitchen,
            });
            await loadInitialData();
        } catch (error) {
            console.error("Error placing order:", error);
            errorMessage = error instanceof Error ? error.message : "Failed to place order.";
        } finally {
            isLoading = false;
        }
    }

    async function handleOrderCancelled(event: CustomEvent<{ date: Date }>) {
        const dayToCancel = weekDays.find(d => d.date.toDateString() === event.detail.date.toDateString());
        if (!dayToCancel || !dayToCancel.order) return;

        isLoading = true;
        errorMessage = null;
        try {
            await orderService.cancelOrder(dayToCancel.order.id);
            await loadInitialData();
        } catch (error) {
            console.error("Error cancelling order:", error);
            errorMessage = error instanceof Error ? error.message : "Failed to cancel order.";
        } finally {
            isLoading = false;
        }
    }

    function handleSaveDefault(event: CustomEvent<{ items: OrderItemData[]; location: Location }>) {
        const { items, location } = event.detail;
        if (!location) {
            errorMessage = "Cannot save default without a location.";
            return;
        }
        localStorageService.saveDefaultOrder(items, location);
        loadInitialData(); // Reload data to reflect new defaults immediately
    }
</script>

<div class="container mx-auto p-4 min-h-screen bg-gray-50">
    <header class="mb-6">
        <div class="flex justify-between items-center py-3 px-2 bg-white shadow-sm rounded-md">
            <h1 class="text-xl font-semibold text-gray-700">GoPay Shortcuts - Orders</h1>
            <div>
                <span class="text-sm text-gray-600 mr-3">user@example.com</span>
                <button on:click={() => alert('Logout clicked')} class="text-sm text-blue-600 hover:underline">Logout</button>
            </div>
        </div>
    </header>

    <main>
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">This Week's Orders</h2>

        {#if isLoading && weekDays.length === 0}
            <div class="flex justify-center items-center py-10">
                <LoadingSpinner />
            </div>
        {:else if errorMessage}
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md shadow" role="alert">
                <p class="font-bold">Error</p>
                <p>{errorMessage}</p>
            </div>
        {/if}

        <LocationSelector {locations} bind:selectedLocation={selectedLocationState} on:locationChange={handleLocationChange} />

        {#if selectedLocationState}
            <p class="mb-4 text-sm text-gray-600 px-1">
                Currently selected delivery location: <span class="font-semibold">{selectedLocationState.name}</span> (Kitchen: <span class="font-semibold">{selectedLocationState.kitchen.name}</span>)
            </p>
        {:else if !isLoading && locations.length > 0 && !selectedLocationState}
            <p class="mb-4 text-sm text-orange-600 font-medium p-3 bg-orange-100 border border-orange-300 rounded-md">Please select a delivery location to see order cards.</p>
        {:else if !isLoading && locations.length === 0}
            <p class="mb-4 text-sm text-gray-500 p-3 bg-gray-100 border border-gray-300 rounded-md">No delivery locations available. Please contact support.</p>
        {/if}

        {#if selectedLocationState && weekDays.length > 0}
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {#each weekDays as dayState (dayState.date.toISOString())}
                    <DayCard 
                        bind:dayState 
                        {locations} 
                        selectedLocation={dayState.location}
                        on:orderPlaced={handleOrderPlaced}
                        on:orderCancelled={handleOrderCancelled}
                        on:saveDefault={handleSaveDefault}
                    />
                {/each}
            </div>
        {:else if selectedLocationState && weekDays.length === 0 && !isLoading}
            <p class="text-center text-gray-500 py-5">No orders or workday data to display for the selected criteria.</p>
        {/if}
    </main>

    <footer class="text-center py-6 mt-8 text-sm text-gray-500">
        Food Shortcuts App &copy; {new Date().getFullYear()}
    </footer>
</div>
