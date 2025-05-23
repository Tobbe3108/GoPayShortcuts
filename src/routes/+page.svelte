<script lang="ts">
    import DayCard from "$lib/components/DayCard.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import { locationService, orderService, localStorageService } from "$lib/services/orderService";
    import type { DayOrderState, Location, Order, OrderItemData, Kitchen, OrderLine } from "../lib/types/orders";
    import { onMount } from "svelte";

    let weekDays: DayOrderState[] = [];
    let locations: Location[] = [];
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

            const startOfWeek = getStartOfWeek(new Date());
            const fetchedOrders = await orderService.getOrdersForWeek(startOfWeek);
            const workdaysDates = getWorkdays(startOfWeek);

            weekDays = workdaysDates.map(date => {
                const existingOrder = fetchedOrders.find(
                    o => new Date(o.deliveryTime).toDateString() === date.toDateString()
                );

                let dayLocationToSet: Location | undefined;
                let dayKitchenToSet: Kitchen | undefined;
                let breakfastQty = 0;
                let lunchQty = 0;
                let sodaQty = 0;

                if (existingOrder) {
                    dayLocationToSet = existingOrder.deliveryLocation;
                    dayKitchenToSet = existingOrder.kitchen;
                    existingOrder.orderLines.forEach((line: OrderLine) => {
                        const productInfo = itemProductMap[line.productId];
                        if (productInfo) {
                            if (productInfo.type === 'breakfast') breakfastQty = line.items;
                            else if (productInfo.type === 'lunch') lunchQty = line.items;
                            else if (productInfo.type === 'soda') sodaQty = line.items;
                        }
                    });
                } else { // No existing order, apply defaults
                    if (defaultOrderPref) {
                        defaultOrderPref.items.forEach(item => {
                            if (item.type === 'breakfast') breakfastQty = item.quantity;
                            if (item.type === 'lunch') lunchQty = item.quantity;
                            if (item.type === 'soda') sodaQty = item.quantity;
                        });
                        // Try to set location from default preferences
                        if (defaultOrderPref.location) {
                            const validDefaultLoc = locations.find(l =>
                                l.name === defaultOrderPref.location.name &&
                                l.kitchen.id === defaultOrderPref.location.kitchen.id
                            );
                            if (validDefaultLoc) {
                                dayLocationToSet = validDefaultLoc;
                                dayKitchenToSet = validDefaultLoc.kitchen;
                            }
                        }
                    }
                    // If location not set from defaultOrderPref.location, use initialSelectedLocation (which might also be from default or first available)
                    if (!dayLocationToSet && initialSelectedLocation) {
                        dayLocationToSet = initialSelectedLocation;
                        dayKitchenToSet = initialSelectedLocation.kitchen;
                    }
                    // Absolute fallback if still no location and locations are available
                    if (!dayLocationToSet && locations.length > 0) {
                        dayLocationToSet = locations[0];
                        dayKitchenToSet = locations[0].kitchen;
                    }
                }

                // Final safety net: if dayLocationToSet is still undefined but locations are available, use the first one.
                if (!dayLocationToSet && locations.length > 0) {
                    dayLocationToSet = locations[0];
                    dayKitchenToSet = locations[0].kitchen;
                } else if (!dayLocationToSet) {
                    // This state indicates an issue, as locations should be available.
                    // Log a warning. The DayCard component will need to handle a potentially undefined location.
                    console.warn(`DayCard for date ${date.toDateString()} is being initialized without a location.`);
                    // To prevent a crash, you might assign a placeholder or handle it in DayCard
                    // For now, we assert non-null below, which means DayCard must be robust.
                }

                return {
                    date,
                    hasOrder: !!existingOrder,
                    order: existingOrder,
                    location: dayLocationToSet!, 
                    kitchen: dayKitchenToSet!,
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

    async function handleOrderPlaced(event: CustomEvent<{ date: Date; items: OrderItemData[]; location: Location }>) {
        const { date, items, location } = event.detail;
        if (!location) {
            errorMessage = "Cannot place order: Location is missing for the day.";
            return;
        }
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
                deliveryLocation: location,
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
        const { date } = event.detail;
        const dayToUpdate = weekDays.find(d => d.date.toDateString() === date.toDateString());
        if (dayToUpdate && dayToUpdate.order) {
            isLoading = true;
            errorMessage = null;
            try {
                await orderService.cancelOrder(dayToUpdate.order.id);
                weekDays = weekDays.map(day => {
                    if (day.date.toDateString() === date.toDateString()) {
                        const defaultOrderPref = localStorageService.getDefaultOrder();
                        let newBreakfast = 0, newLunch = 0, newSoda = 0;
                        // Default to the card's current location as a starting point.
                        let newLocation = day.location; 

                        if (defaultOrderPref) {
                            defaultOrderPref.items.forEach(item => {
                                if (item.type === 'breakfast') newBreakfast = item.quantity;
                                if (item.type === 'lunch') newLunch = item.quantity;
                                if (item.type === 'soda') newSoda = item.quantity;
                            });

                            // If a default location is set in preferences, try to apply it.
                            if (defaultOrderPref.location) {
                                const validDefaultLoc = locations.find(l =>
                                    l.name === defaultOrderPref.location.name &&
                                    l.kitchen.id === defaultOrderPref.location.kitchen.id
                                );
                                if (validDefaultLoc) {
                                    newLocation = validDefaultLoc; // Apply valid default location.
                                } 
                                // If defaultOrderPref.location is not valid (not in current `locations`), 
                                // newLocation remains `day.location` (the card's current location before cancellation).
                            }
                        } 
                        // If no defaultOrderPref, item quantities are 0, and location remains `day.location`.
                        
                        return {
                            ...day,
                            hasOrder: false,
                            order: undefined,
                            location: newLocation, 
                            kitchen: newLocation.kitchen, 
                            breakfast: newBreakfast,
                            lunch: newLunch,
                            soda: newSoda,
                        };
                    }
                    return day;
                });
            } catch (err: any) {
                console.error("Error cancelling order:", err);
                errorMessage = err instanceof Error ? err.message : "Failed to cancel order.";
            } finally {
                isLoading = false;
            }
        }
    }

    function handleSaveDefault(event: CustomEvent<{ items: OrderItemData[]; location: Location }>) {
        const { items, location } = event.detail;
        if (!location) {
            errorMessage = "Cannot save default: Location is missing.";
            return;
        }
        localStorageService.saveDefaultOrder(items, location);
        weekDays = weekDays.map(day => {
            if (!day.hasOrder) {
                let newBreakfast = 0, newLunch = 0, newSoda = 0;
                items.forEach(item => {
                    if (item.type === 'breakfast') newBreakfast = item.quantity;
                    if (item.type === 'lunch') newLunch = item.quantity;
                    if (item.type === 'soda') newSoda = item.quantity;
                });
                return {
                    ...day,
                    location: location,
                    kitchen: location.kitchen,
                    breakfast: newBreakfast,
                    lunch: newLunch,
                    soda: newSoda,
                };
            }
            return day;
        });
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

        {#if weekDays.length > 0}
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {#each weekDays as dayState (dayState.date.toISOString())}
                    <DayCard 
                        bind:dayState={dayState} 
                        locations={locations}
                        on:orderPlaced={handleOrderPlaced}
                        on:orderCancelled={handleOrderCancelled}
                        on:saveDefault={handleSaveDefault}
                    />
                {/each}
            </div>
        {:else if !isLoading && weekDays.length === 0}
            <p class="text-center text-gray-500 py-5">No orders or workday data to display for the selected criteria.</p>
        {/if}
    </main>

    <footer class="text-center py-6 mt-8 text-sm text-gray-500">
        Food Shortcuts App &copy; {new Date().getFullYear()}
    </footer>
</div>
