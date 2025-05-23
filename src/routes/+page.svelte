<script lang="ts">    import DayCard from "$lib/components/DayCard.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import { locationService, orderService, localStorageService } from "$lib/services/orderService";
    import type { DayOrderState, Location, OrderItemData, Kitchen, OrderLine } from "../lib/types/orders";
    import orderStore from "$lib/stores/orderStore";
    import authStore from "$lib/stores/authStore";
    import { goto } from "$app/navigation";

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
        orderStore.update(s => ({ ...s, isLoading: true, errorMessage: null }));
        try {
            const fetchedLocations = await locationService.getLocations();
            orderStore.update(s => ({ ...s, locations: fetchedLocations }));

            const defaultOrderPref = localStorageService.getDefaultOrder();
            let initialSelectedLocation: Location | undefined = undefined;

            if (defaultOrderPref && defaultOrderPref.location) {
                // Match by ID for robustness
                const validDefaultLocation = fetchedLocations.find(l => l.id === defaultOrderPref.location.id);
                if (validDefaultLocation) {
                    initialSelectedLocation = validDefaultLocation;
                }
            }

            if (!initialSelectedLocation && fetchedLocations.length > 0) {
                initialSelectedLocation = fetchedLocations[0];
            }

            const startOfWeek = getStartOfWeek(new Date());
            const fetchedOrders = await orderService.getOrdersForWeek(startOfWeek);
            const workdaysDates = getWorkdays(startOfWeek);

            const newWeekDays = workdaysDates.map(date => {
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
                        if (defaultOrderPref.location) {
                            // Match by ID for robustness
                            const validDefaultLoc = fetchedLocations.find(l => l.id === defaultOrderPref.location.id);
                            if (validDefaultLoc) {
                                dayLocationToSet = validDefaultLoc;
                                dayKitchenToSet = validDefaultLoc.kitchen;
                            }
                        }
                    }
                }
                
                // Fallback to initialSelectedLocation if no specific location was set by order or default preference
                if (!dayLocationToSet && initialSelectedLocation) {
                    dayLocationToSet = initialSelectedLocation;
                    dayKitchenToSet = initialSelectedLocation.kitchen;
                }

                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isToday = date.toDateString() === new Date().toDateString();

                return {
                    date,
                    selectedLocation: dayLocationToSet,
                    selectedKitchen: dayKitchenToSet,
                    breakfastQuantity: breakfastQty,
                    lunchQuantity: lunchQty,
                    sodaQuantity: sodaQty,
                    isSaving: false,
                    saveError: null,
                    existingOrderId: existingOrder?.id,
                    isWeekend, 
                    isToday    
                };
            });
            orderStore.update(s => ({ ...s, weekDays: newWeekDays, isLoading: false }));

        } catch (err: any) {
            console.error("Error loading initial data:", err);
            orderStore.update(s => ({ ...s, isLoading: false, errorMessage: err.message || "Failed to load order data." }));
        }    }    
    
    $effect.root(() => {
        if (!$authStore.user) {
            goto('/login');
        } else {
            loadInitialData();
        }
    });

    function handleLocationChangeInPage(event: CustomEvent<{ date: Date, newLocation: Location | undefined }>) { // Allow newLocation to be undefined
        const { date, newLocation } = event.detail;
        orderStore.update(s => ({
            ...s,
            weekDays: s.weekDays.map(day => {
                if (day.date.toDateString() === date.toDateString()) {
                    return {
                        ...day,
                        selectedLocation: newLocation, // This can be undefined
                        selectedKitchen: newLocation?.kitchen // Use optional chaining
                    };
                }
                return day;
            })
        }));
    }

    async function handleOrderUpdate(event: CustomEvent<{ date: Date, items: OrderItemData[], location: Location }>) {
        const { date, items, location } = event.detail;
        
        const dayStateToUpdate = $orderStore.weekDays.find(d => d.date.toDateString() === date.toDateString());
        if (!dayStateToUpdate) return;

        orderStore.update(s => ({
            ...s,
            weekDays: s.weekDays.map(day => 
                day.date.toDateString() === date.toDateString() 
                ? { ...day, isSaving: true, saveError: null } 
                : day
            )
        }));

        try {
            const orderLinesPayload: OrderLine[] = items
                .filter(item => item.quantity > 0)
                .map(item => ({ productId: item.id, items: item.quantity, buyerParty: "PRIVATE" }));

            if (!location || !location.kitchen) {
                throw new Error("Location and Kitchen must be selected.");
            }

            if (orderLinesPayload.length > 0) {
                if (dayStateToUpdate.existingOrderId) {
                    await orderService.cancelOrder(dayStateToUpdate.existingOrderId);
                }
                await orderService.placeOrder({
                    deliveryTime: date.toISOString(),
                    deliveryLocation: location,
                    kitchen: location.kitchen,
                    orderLines: orderLinesPayload
                });
            } else if (dayStateToUpdate.existingOrderId) {
                await orderService.cancelOrder(dayStateToUpdate.existingOrderId);
            }
            await loadInitialData(); 
        } catch (err: any) {
            console.error("Error updating order:", err);
            orderStore.update(s => ({
                ...s,
                weekDays: s.weekDays.map(day => 
                    day.date.toString() === date.toString() 
                    ? { ...day, isSaving: false, saveError: err.message || "Failed to save order." } 
                    : day
                ),
                errorMessage: err.message || "Failed to save order."
            }));
        }
    }

    async function handleOrderCancelled(event: CustomEvent<{ date: Date }>) {
        const { date } = event.detail;
        const dayStateToUpdate = $orderStore.weekDays.find(d => d.date.toDateString() === date.toDateString());

        if (dayStateToUpdate && dayStateToUpdate.existingOrderId) {
            orderStore.update(s => ({
                ...s,
                weekDays: s.weekDays.map(day => 
                    day.date.toDateString() === date.toDateString() 
                    ? { ...day, isSaving: true, saveError: null } 
                    : day
                )
            }));
            try {
                await orderService.cancelOrder(dayStateToUpdate.existingOrderId);
                await loadInitialData();
            } catch (err: any) {
                console.error("Error cancelling order:", err);
                orderStore.update(s => ({
                    ...s,
                    weekDays: s.weekDays.map(day => 
                        day.date.toDateString() === date.toDateString() 
                        ? { ...day, isSaving: false, saveError: err.message || "Failed to cancel order." } 
                        : day
                    ),
                    errorMessage: err.message || "Failed to cancel order."
                }));
            }
        }
    }

    async function handleOrderAllWeek() {
        const firstDayWithSettings = $orderStore.weekDays.find(day => 
            !day.isWeekend && 
            day.selectedLocation && 
            day.selectedKitchen && 
            (day.breakfastQuantity > 0 || day.lunchQuantity > 0 || day.sodaQuantity > 0)
        );

        if (!firstDayWithSettings || !firstDayWithSettings.selectedLocation || !firstDayWithSettings.selectedKitchen) {
            orderStore.update(s => ({ ...s, errorMessage: "Set location and items for a weekday (e.g., Monday) to order for the week." }));
            return;
        }

        const locationToUse = firstDayWithSettings.selectedLocation;
        const kitchenToUse = firstDayWithSettings.selectedKitchen;
        const orderLinesPayload: OrderLine[] = [];
        if (firstDayWithSettings.breakfastQuantity > 0) orderLinesPayload.push({ productId: 1, items: firstDayWithSettings.breakfastQuantity, buyerParty: "PRIVATE" });
        if (firstDayWithSettings.lunchQuantity > 0) orderLinesPayload.push({ productId: 2, items: firstDayWithSettings.lunchQuantity, buyerParty: "PRIVATE" });
        if (firstDayWithSettings.sodaQuantity > 0) orderLinesPayload.push({ productId: 3, items: firstDayWithSettings.sodaQuantity, buyerParty: "PRIVATE" });

        if (orderLinesPayload.length === 0) {
            orderStore.update(s => ({ ...s, errorMessage: "Please set quantities for at least one item on the template day."}) );
            return;
        }
        
        orderStore.update(s => ({ ...s, isLoading: true, errorMessage: null }));

        try {
            for (const dayState of $orderStore.weekDays) {
                if (dayState.isWeekend) continue;

                orderStore.update(s => ({
                    ...s,
                    weekDays: s.weekDays.map(d => d.date.toDateString() === dayState.date.toDateString() ? { ...d, isSaving: true, saveError: null } : d)
                }));

                if (dayState.existingOrderId) {
                    await orderService.cancelOrder(dayState.existingOrderId);
                }
                await orderService.placeOrder({
                    deliveryTime: dayState.date.toISOString(),
                    deliveryLocation: locationToUse,
                    kitchen: kitchenToUse,
                    orderLines: orderLinesPayload
                });
            }
            await loadInitialData(); 
        } catch (err: any) {
            console.error("Error ordering for all week:", err);
            orderStore.update(s => ({ ...s, isLoading: false, errorMessage: err.message || "Failed to order for the week." }));
        } finally {
            orderStore.update(s => ({ ...s, isLoading: false }));
        }
    }

    async function handleDeleteTodaysOrders() {
        const today = new Date();
        const todayState = $orderStore.weekDays.find(day => day.date.toDateString() === today.toDateString());

        if (todayState && todayState.existingOrderId) {
            orderStore.update(s => ({
                ...s,
                weekDays: s.weekDays.map(d => d.date.toDateString() === today.toDateString() ? { ...d, isSaving: true, saveError: null } : d)
            }));
            try {
                await orderService.cancelOrder(todayState.existingOrderId);
                await loadInitialData(); 
            } catch (err: any) {
                console.error("Error deleting today's order:", err);
                orderStore.update(s => ({
                    ...s,
                    weekDays: s.weekDays.map(d => 
                        d.date.toDateString() === today.toDateString() 
                        ? { ...d, isSaving: false, saveError: err.message || "Failed to delete order." } 
                        : d
                    ),
                    errorMessage: err.message || "Failed to delete order."
                }));
            }
        } else {
            orderStore.update(s => ({ ...s, errorMessage: "No order to delete for today." }));
        }
    }
    
    function handleSaveDefault(event: CustomEvent<{ items: OrderItemData[], location: Location | undefined }>) { // Allow location to be undefined
        const { items, location } = event.detail;
        localStorageService.saveDefaultOrder(items, location);

        // Update all applicable day cards with the new default, including location
        orderStore.update(s => ({
            ...s,
            weekDays: s.weekDays.map(day => {
                // Only update if no order exists for the day and it's not a weekend
                if (!day.existingOrderId && !day.isWeekend) {
                    return {
                        ...day,
                        selectedLocation: location, // Apply new default location (can be undefined)
                        selectedKitchen: location?.kitchen, // Apply new default kitchen (can be undefined)
                        breakfastQuantity: items.find(i => i.type === 'breakfast')?.quantity ?? 0, // Use ?? 0 to handle undefined quantity
                        lunchQuantity: items.find(i => i.type === 'lunch')?.quantity ?? 0,
                        sodaQuantity: items.find(i => i.type === 'soda')?.quantity ?? 0,
                    };
                }
                return day;
            })
        }));
    }    const canOrderAllWeek = $derived(() => {
        if ($orderStore.isLoading) return false;
        const firstDay = $orderStore.weekDays.find(day => !day.isWeekend);
        // Allow ordering all week even if location is not set, as long as items are present
        return !!(firstDay && 
               (firstDay.breakfastQuantity > 0 || firstDay.lunchQuantity > 0 || firstDay.sodaQuantity > 0));
    });

    function canDeleteTodaysOrders(): boolean {
        if ($orderStore.isLoading) return false;
        const today = new Date().toDateString();
        const todayState = $orderStore.weekDays.find(day => day.date.toDateString() === today);
        return !!(todayState && todayState.existingOrderId);
    }

</script>

<div class="container p-4 mx-auto">
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Weekly Food Order</h1>
        <button 
            on:click={() => { authStore.set({ user: null, loading: false, error: null }); localStorage.removeItem('food_shortcuts_auth'); goto('/login'); }}
            class="px-4 py-2 font-semibold text-white transition duration-150 ease-in-out bg-red-500 rounded-lg shadow hover:bg-red-600"
        >
            Logout
        </button>
    </div>

    {#if $orderStore.errorMessage}
        <div class="fixed z-50 px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded shadow-lg top-4 right-4" role="alert">
            <div class="flex justify-between">
                <p class="font-bold">Error</p>
                <button on:click={() => orderStore.update(s => ({...s, errorMessage: null}))} class="font-bold text-red-700 hover:text-red-900">&times;</button>
            </div>
            <p>{$orderStore.errorMessage}</p>
        </div>
    {/if}

    {#if $orderStore.isLoading && $orderStore.weekDays.length === 0}
        <div class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingSpinner size="w-12 h-12" />
            <p class="mt-4 text-gray-600">Loading orders...</p>
        </div>    {:else if $orderStore.weekDays.length > 0}
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {#each $orderStore.weekDays as dayState, i (dayState.date.toISOString())}
                <DayCard 
                    dayState={dayState} 
                    locations={$orderStore.locations} 
                    on:orderPlaced={handleOrderUpdate} 
                    on:orderCancelled={handleOrderCancelled} 
                    on:locationChanged={handleLocationChangeInPage}
                    on:saveDefault={handleSaveDefault} 
                />
            {/each}
        </div>
    {:else if !$orderStore.isLoading} 
        <p class="mt-10 text-center text-gray-500">No order data available for this week.</p>
    {/if}
</div>
