<script lang="ts">
  import type { DayOrderState, Location, OrderItemData } from "../types/orders";
  import { createEventDispatcher } from "svelte";
  import LocationSelector from "./LocationSelector.svelte"; 
  import { PRODUCT_IDS } from "$lib/constants/products";

  // Ensure onLocationChange is correctly typed in $props
  const { dayState, locations, onLocationChange: onLocationChangeProp } = $props<{
    dayState: DayOrderState;
    locations: Location[];
    onLocationChange: (date: Date, newLocation: Location | null) => void;
  }>();
  
  const dispatch = createEventDispatcher();
  // Define itemProductMap first so we can use it for initialization
  const itemProductMap: Record<number, { name: string, type: 'breakfast' | 'lunch' | 'soda' }> = {
    [PRODUCT_IDS.BREAKFAST]: { name: "Morgenmad", type: "breakfast" },
    [PRODUCT_IDS.LUNCH]: { name: "Frokost", type: "lunch" },
    [PRODUCT_IDS.SODA]: { name: "Læskedrik", type: "soda" },
  };

  let isLoading = $state(false);
  // Initialize orderItems with the appropriate quantities from dayState
  let orderItems = $state<OrderItemData[]>(
    Object.entries(itemProductMap).map(([idStr, productDetails]) => ({
      id: parseInt(idStr),
      name: productDetails.name,
      quantity: productDetails.type === 'breakfast' ? dayState.breakfastQuantity :
                productDetails.type === 'lunch' ? dayState.lunchQuantity :
                productDetails.type === 'soda' ? dayState.sodaQuantity : 0,
      type: productDetails.type,
    }))
  );
  
  let _currentDayOrderExistingId = $state(dayState.existingOrderId);
  let optimisticHasOrder = $derived(!!_currentDayOrderExistingId);

  // Reactive effect to update optimisticHasOrder when existingOrderId changes from prop
  $effect(() => {
    if (dayState.existingOrderId !== _currentDayOrderExistingId) {
      _currentDayOrderExistingId = dayState.existingOrderId;
      optimisticHasOrder = !!_currentDayOrderExistingId;
    }
  });

  // dayState.selectedLocation is the source of truth for display and actions.
  // The LocationSelector will emit an event when the user changes the selection.  
  function placeOrder() {
    if (!dayState.selectedLocation) { 
      // Use dayState.selectedLocation
      alert("Vælg venligst en lokation for denne dag.");
      return;
    }
    if (orderItems.every(item => item.quantity === 0)) {
      alert("Kan ikke placere en tom bestilling.");
      return;
    }
    if (isPastDate(dayState.date)) {
      alert("Du kan ikke placere bestillinger for en dag i fortiden.");
      return;
    }
    for (const item of orderItems) {
      if (item.type === 'breakfast' && item.quantity > 0 && !isOrderTimeAllowed(item.type, dayState.date)) {
        alert('Du kan ikke bestille morgenmad mere i dag.');
        return;
      }
      if (item.type === 'lunch' && item.quantity > 0 && !isOrderTimeAllowed(item.type, dayState.date)) {
        alert('Du kan ikke bestille frokost mere i dag.');
        return;
      }
    }
    isLoading = true;
    optimisticHasOrder = true; 

    // Use the current orderItems quantities which are now managed independently
    // from location changes
    setTimeout(() => {
      let data = { 
        date: dayState.date, 
        items: orderItems.filter(i => i.quantity > 0),
        location: dayState.selectedLocation // Use dayState.selectedLocation
      }
      console.log("Placing order with data:", data);
      dispatch("orderPlaced", data);
      isLoading = false; 
    }, 1000);
  }

  function cancelOrder() {
    isLoading = true;
    optimisticHasOrder = false; 

    orderItems = Object.entries(itemProductMap).map(([idStr, productDetails]) => ({
        id: parseInt(idStr),
        name: productDetails.name,
        quantity: productDetails.type === 'breakfast' ? dayState.breakfastQuantity :
                  productDetails.type === 'lunch' ? dayState.lunchQuantity :
                  productDetails.type === 'soda' ? dayState.sodaQuantity : 0,
        type: productDetails.type,
    }));

    setTimeout(() => {
      dispatch("orderCancelled", { date: dayState.date });
      isLoading = false; 
    }, 1000);
  }
  function saveAsDefault() {
    // Pass location only if it was explicitly selected
    const defaultItemsToSave = orderItems.map(item => ({ 
      id: item.id, 
      quantity: item.quantity, 
      type: item.type, 
      name: item.name 
    }));
    
    // Explicitly use dayState.selectedLocation which can be undefined
    dispatch("saveDefault", { 
      items: defaultItemsToSave, 
      location: dayState.selectedLocation 
    });
  }  // Track the current location ID and quantities to detect changes
  let previousLocationId = dayState.selectedLocation?.id;
  let previousBreakfastQty = dayState.breakfastQuantity;
  let previousLunchQty = dayState.lunchQuantity;
  let previousSodaQty = dayState.sodaQuantity;
  
  // Reactive effect to respond to both order status and quantity changes
  $effect(() => {
    const currentLocationId = dayState.selectedLocation?.id;
    const quantitiesChanged = 
      dayState.breakfastQuantity !== previousBreakfastQty ||
      dayState.lunchQuantity !== previousLunchQty ||
      dayState.sodaQuantity !== previousSodaQty;
    
    // Case 1: Order status changed (created/cancelled)
    if (dayState.existingOrderId !== _currentDayOrderExistingId) {
      if (optimisticHasOrder) { 
        // Order was just created, update quantities from dayState
        orderItems = Object.entries(itemProductMap).map(([idStr, productDetails]) => {
          const productId = parseInt(idStr);
          let qty = 0;
          if (productDetails.type === 'breakfast') qty = dayState.breakfastQuantity;
          else if (productDetails.type === 'lunch') qty = dayState.lunchQuantity;
          else if (productDetails.type === 'soda') qty = dayState.sodaQuantity;
          
          return {
            id: productId,
            name: productDetails.name,
            quantity: qty,
            type: productDetails.type,
          };
        });
      }
    }
    // Case 2: Default quantities were updated (when not in order-placed mode)
    else if (!optimisticHasOrder && quantitiesChanged) {
      // Update orderItems with the new default quantities
      orderItems = Object.entries(itemProductMap).map(([idStr, productDetails]) => {
        const productId = parseInt(idStr);
        let qty = 0;
        if (productDetails.type === 'breakfast') qty = dayState.breakfastQuantity;
        else if (productDetails.type === 'lunch') qty = dayState.lunchQuantity;
        else if (productDetails.type === 'soda') qty = dayState.sodaQuantity;
        
        return {
          id: productId,
          name: productDetails.name,
          quantity: qty,
          type: productDetails.type,
        };
      });
    }
    
    // Update previous values for next comparison
    previousLocationId = currentLocationId;
    previousBreakfastQty = dayState.breakfastQuantity;
    previousLunchQty = dayState.lunchQuantity;
    previousSodaQty = dayState.sodaQuantity;
  });
  function handleItemChange(itemId: number, change: number) {
    const itemIndex = orderItems.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
      const itemToChange = orderItems[itemIndex];
      const newQuantity = Math.max(0, itemToChange.quantity + change);
      // With $state, we can directly mutate arrays
      orderItems[itemIndex] = { ...itemToChange, quantity: newQuantity };
      // No need for the spread operator to trigger reactivity with $state
    }
  }  // Import date formatting utilities
  import { formatDay, formatDate, isPastDate, isSameDate } from "$lib/utils/dateUtils";
  
  // Handles the 'locationChanged' event from LocationSelector
  function handleLocationSelectedFromDropdown(newLocation: Location | null) {
    // The event.detail from LocationSelector is now directly the Location object or null
    // Dispatch an event that the parent component (+page.svelte) will handle
    if (dayState && typeof dayState.date !== 'undefined') {
      // Call the onLocationChange prop function directly using the aliased name
      if (onLocationChangeProp) {
        onLocationChangeProp(dayState.date, newLocation);
      }
    } else {
      console.error("DayCard: dayState or dayState.date is undefined when handling location change.");
    }
  }

  const getTotalItems = () => orderItems.reduce((acc, item) => acc + item.quantity, 0);

  function isOrderTimeAllowed(itemType: 'breakfast' | 'lunch' | 'soda', date: Date): boolean {
    const now = new Date();
    if (!isSameDate(now, date)) return true;
    const hour = now.getHours();
    if (itemType === 'breakfast') return hour < 10;
    if (itemType === 'lunch') return hour < 13;
    return true;
  }
</script>

<div class="bg-white shadow-lg rounded-lg p-4 md:p-6 flex flex-col space-y-4 border border-slate-200 {dayState.isWeekend ? 'opacity-70 bg-slate-50' : ''} {dayState.isToday ? 'border-slate-800 border-2' : ''}">  <div class="flex items-center justify-between">
    <h3 class="text-xl font-semibold text-slate-800">{formatDay(dayState.date)}</h3>
    <span class="text-sm text-slate-500">{formatDate(dayState.date)}</span>
  </div>

  {#if !optimisticHasOrder && !dayState.isWeekend}    <LocationSelector 
      selectedLocation={dayState.selectedLocation}
      locations={locations} 
      onLocationChange={handleLocationSelectedFromDropdown}
    />
  {/if}  {#if dayState.isWeekend}
    <p class="italic text-center text-slate-600">Weekend - Ingen bestillinger</p>
  {:else}
    {#if optimisticHasOrder}      <!-- Receipt View -->      <div class="p-3 space-y-3 border border-slate-300 rounded bg-slate-50">
        <h4 class="font-semibold text-slate-700 text-md">Bestillingsoversigt:</h4>
        {#if dayState.selectedLocation}
          <p class="text-sm text-slate-600">
            <strong>Lokation:</strong> {dayState.selectedLocation.name}
          </p>
        {/if}
        
        <!-- Show actual order details if available -->
        {#if dayState.existingOrderId && dayState.orderDetails?.orderLines?.length > 0}
          <ul class="pl-0 space-y-1 list-none">            {#each dayState.orderDetails.orderLines as line (line.id)}              <li class="flex justify-between text-slate-700">
                <span>{line.name}</span>
                <span>Antal: {line.items}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <ul class="pl-0 space-y-1 list-none">
            {#each orderItems.filter(item => item.quantity > 0) as item (item.id)}              <li class="flex justify-between text-slate-700">
                <span>{item.name}</span>
                <span>Antal: {item.quantity}</span>
              </li>
            {/each}
          </ul>          {#if orderItems.filter(item => item.quantity > 0).length === 0 && !isLoading}
            <p class="text-sm italic text-slate-500">Ingen varer i denne bestilling.</p>
          {/if}
        {/if}
        
        <!-- Show price if available -->
        {#if dayState.orderDetails?.price}
          <p class="font-medium text-right text-slate-700">
            Totalpris: {dayState.orderDetails.price.formatted}
          </p>
        {/if}
      </div>
      
      <div class="pt-2 border-t border-slate-200">
        <p class="font-medium text-right text-slate-700">Antal varer i alt: {getTotalItems()}</p>
      </div>      <div class="flex flex-col pt-2 space-y-2">
        <!-- Check if cancellation is disabled in order details or if the day is in the past -->        {#if dayState.orderDetails?.cancelDisabled || isPastDate(dayState.date)}
          <button            disabled={true}
            class="w-full px-4 py-2 font-bold text-white transition-opacity duration-150 ease-in-out bg-slate-400 rounded cursor-not-allowed"
          >
            Bestilling kan ikke annulleres
          </button>
        {:else}          <button
            onclick={cancelOrder} 
            class:opacity-50={isLoading}            disabled={isLoading}
            class="w-full px-4 py-2 font-bold text-white transition-opacity duration-150 ease-in-out bg-red-600 rounded hover:bg-red-700"
          >
            {#if isLoading}Annullerer...{:else}Annuller bestilling{/if}
          </button>
        {/if}
        <button
          onclick={saveAsDefault}
          disabled={isLoading}
          class="w-full px-4 py-2 font-bold text-white transition-colors bg-slate-600 rounded hover:bg-slate-500 disabled:opacity-50 disabled:bg-gray-400"
        >
          Gem som standard
        </button>
      </div>
    {:else}
      <!-- Order Creation/Modification View -->
      <div class="space-y-3">
        {#each orderItems as item (item.id)}
          <div class="flex items-center justify-between">
            <span class="text-slate-700">{item.name}</span>
            <div class="flex items-center space-x-2">
                <button
                  onclick={() => handleItemChange(item.id, -1)}
                  disabled={isLoading || item.quantity === 0 || !isOrderTimeAllowed(item.type, dayState.date)}
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
      </div>      <div class="pt-2 border-t border-slate-200">
        <p class="font-medium text-right text-slate-700">Antal varer i alt: {getTotalItems()}</p>
      </div>

      <div class="flex flex-col pt-2 space-y-2">        <button          onclick={placeOrder} 
          class:opacity-50={isLoading}
          disabled={isLoading || getTotalItems() === 0 || !dayState.selectedLocation || isPastDate(dayState.date)}
          class="w-full px-4 py-2 font-bold text-white transition-opacity duration-150 ease-in-out bg-slate-800 rounded hover:bg-slate-700 disabled:bg-gray-400"
        >
          {#if isLoading}Placerer bestilling...{:else}Placér bestilling{/if}
        </button>
      </div>
    {/if}
  {/if}
</div>
