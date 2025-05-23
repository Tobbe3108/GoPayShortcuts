<script lang="ts">
  import type { DayOrderState, Location, OrderItemData, OrderLine } from "../types/orders";
  import { createEventDispatcher } from "svelte";
  import LocationSelector from "./LocationSelector.svelte"; 

  export let dayState: DayOrderState;
  export let locations: Location[];

  const dispatch = createEventDispatcher();

  let isLoading = false;
  let orderItems: OrderItemData[] = [];
  
  let currentLocation: Location = dayState.location; 

  let _currentDayOrder = dayState.order;
  let optimisticHasOrder = !!_currentDayOrder;

  $: {
    if (dayState.order !== _currentDayOrder) {
      _currentDayOrder = dayState.order;
      optimisticHasOrder = !!_currentDayOrder;
    }
  }

  const itemProductMap: Record<number, { name: string, type: 'breakfast' | 'lunch' | 'soda' }> = {
    1: { name: "Breakfast", type: "breakfast" },
    2: { name: "Lunch", type: "lunch" },
    3: { name: "Soda", type: "soda" },
  };

  function placeOrder() {
    if (!currentLocation) {
      alert("Please select a location for this day.");
      return;
    }
    if (orderItems.every(item => item.quantity === 0)) {
      alert("Cannot place an empty order.");
      return;
    }
    isLoading = true;
    optimisticHasOrder = true; 

    setTimeout(() => {
      dispatch("orderPlaced", { 
        date: dayState.date, 
        items: orderItems.filter(i => i.quantity > 0),
        location: currentLocation
      });
      isLoading = false; 
    }, 1000);
  }

  function cancelOrder() {
    isLoading = true;
    optimisticHasOrder = false; 

    // Repopulate orderItems to dayState defaults immediately
    orderItems = Object.entries(itemProductMap).map(([idStr, productDetails]) => ({
        id: parseInt(idStr),
        name: productDetails.name,
        quantity: dayState[productDetails.type] || 0, // Revert to dayState defaults
        type: productDetails.type,
    }));

    setTimeout(() => {
      dispatch("orderCancelled", { date: dayState.date });
      isLoading = false; 
    }, 1000);
  }

  function saveAsDefault() {
    if (!currentLocation) {
      alert("Please select a location before saving as default.");
      return;
    }
    // Dispatch current orderItems quantities for saving as default
    const defaultItemsToSave = orderItems.map(item => ({ id: item.id, quantity: item.quantity, type: item.type }));
    dispatch("saveDefault", { items: defaultItemsToSave, location: currentLocation });
  }

  // Reactive block to populate/update orderItems
  $: {
    if (optimisticHasOrder && dayState.order) { // If an order object exists and we are in receipt view
      orderItems = Object.entries(itemProductMap).map(([idStr, productDetails]) => {
        const productId = parseInt(idStr);
        const orderLine = dayState.order!.orderLines?.find(line => line.productId === productId);
        return {
          id: productId,
          name: productDetails.name,
          quantity: orderLine ? orderLine.items : 0, // Use order quantity, or 0 if not in order
          type: productDetails.type,
        };
      });
    } else if (!optimisticHasOrder) {
      // No order exists (or cancelled), use defaults from dayState for the input view
      // This ensures that when an order is cancelled, it reverts to showing defaults
      orderItems = Object.entries(itemProductMap).map(([idStr, productDetails]) => ({
        id: parseInt(idStr),
        name: productDetails.name,
        quantity: dayState[productDetails.type] || 0, // Use default from dayState
        type: productDetails.type,
      }));
    }
    // If optimisticHasOrder is true but dayState.order is not yet populated (e.g. during placeOrder loading),
    // orderItems will retain its current state (optimistically set by placeOrder or from previous state)
    // until dayState.order updates and the first condition of this block is met.
  }

  function handleItemChange(itemId: number, change: number) {
    const itemIndex = orderItems.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
      const itemToChange = orderItems[itemIndex];
      const newQuantity = Math.max(0, itemToChange.quantity + change);

      orderItems[itemIndex] = { ...itemToChange, quantity: newQuantity };
      orderItems = [...orderItems];
    }
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const getFormattedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  function handleLocationChange(event: CustomEvent<Location>) {
    currentLocation = event.detail;
    // Do not mutate dayState here, location changes should be handled by the parent if needed
    // For placing an order, the current `currentLocation` will be used.
  }

  $: if (dayState.location && (!currentLocation || dayState.location.name !== currentLocation.name || dayState.location.kitchen.id !== currentLocation.kitchen.id )) {
    currentLocation = dayState.location;
  }

  const getTotalItems = () => orderItems.reduce((acc, item) => acc + item.quantity, 0);
</script>

<div class="bg-white shadow-lg rounded-lg p-4 md:p-6 flex flex-col space-y-4 border border-gray-200 {dayState.isWeekend ? 'opacity-70 bg-gray-50' : ''} {dayState.isToday ? 'border-blue-500 border-2' : ''}">
  <div class="flex items-center justify-between">
    <h3 class="text-xl font-semibold text-gray-800">{getDayName(dayState.date)}</h3>
    <span class="text-sm text-gray-500">{dayState.date.toLocaleDateString()}</span>
  </div>

  {#if !optimisticHasOrder}
    <LocationSelector bind:selectedLocation={currentLocation} {locations} disabled={isLoading} />
  {/if}

  {#if dayState.isWeekend}
    <p class="italic text-center text-gray-600">Weekend - No orders</p>
  {:else}
    {#if optimisticHasOrder}
      <!-- Receipt View -->
      <div class="p-3 space-y-3 border border-gray-300 rounded bg-gray-50">
        <h4 class="font-semibold text-gray-700 text-md">Order Summary:</h4>
        {#if currentLocation}
          <p class="text-sm text-gray-600">
            <strong>Location:</strong> {currentLocation.name} 
            {#if currentLocation.kitchen && currentLocation.kitchen.name}
              - {currentLocation.kitchen.name}
            {/if}
          </p>
        {/if}
        <ul class="pl-0 space-y-1 list-none">
          {#each orderItems.filter(item => item.quantity > 0) as item (item.id)}
            <li class="flex justify-between text-gray-700">
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
            </li>
          {/each}
        </ul>
        {#if orderItems.filter(item => item.quantity > 0).length === 0 && !isLoading}
          <p class="text-sm italic text-gray-500">No items in this order.</p>
        {/if}
      </div>
      <div class="pt-2 border-t border-gray-200">
        <p class="font-medium text-right text-gray-700">Total items: {getTotalItems()}</p>
      </div>
      <div class="flex flex-col pt-2 space-y-2">
        <button 
          on:click={cancelOrder} 
          class:opacity-50={isLoading}
          disabled={isLoading}
          class="w-full px-4 py-2 font-bold text-white transition-opacity duration-150 ease-in-out bg-red-500 rounded hover:bg-red-700"
        >
          {#if isLoading && !optimisticHasOrder}Processing...{:else if isLoading && optimisticHasOrder}Cancelling...{:else}Cancel Order{/if}
        </button>
      </div>
    {:else}
      <!-- Order Creation/Modification View -->
      <div class="space-y-3">
        {#each orderItems as item (item.id)}
          <div class="flex items-center justify-between">
            <span class="text-gray-700">{item.name}</span>
            <div class="flex items-center space-x-2">
              <button
                on:click={() => handleItemChange(item.id, -1)}
                disabled={isLoading || item.quantity === 0}
                class="px-2 py-1 font-bold text-gray-700 transition-colors bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
              >
                -
              </button>
              <span class="w-8 text-center text-gray-700">{item.quantity}</span>
              <button
                on:click={() => handleItemChange(item.id, 1)}
                disabled={isLoading}
                class="px-2 py-1 font-bold text-gray-700 transition-colors bg-gray-200 rounded-r hover:bg-gray-300 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        {/each}
      </div>

      <div class="pt-2 border-t border-gray-200">
        <p class="font-medium text-right text-gray-700">Total items: {getTotalItems()}</p>
      </div>

      <div class="flex flex-col pt-2 space-y-2">
        <button 
          on:click={placeOrder} 
          class:opacity-50={isLoading}
          disabled={isLoading || getTotalItems() === 0}
          class="w-full px-4 py-2 font-bold text-white transition-opacity duration-150 ease-in-out bg-green-500 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {#if isLoading && optimisticHasOrder}Processing...{:else if isLoading && !optimisticHasOrder}Placing Order...{:else}Place Order{/if}
        </button>
        <button 
          on:click={saveAsDefault}
          disabled={isLoading || getTotalItems() === 0}
          class="w-full px-4 py-2 font-bold text-white transition-colors bg-blue-500 rounded hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400"
        >
          Save as Default
        </button>
      </div>
    {/if}
  {/if}
</div>
