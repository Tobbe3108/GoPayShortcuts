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

  const itemProductMap: Record<number, { name: string, type: 'breakfast' | 'lunch' | 'soda', defaultQuantity?: number }> = {
    1: { name: "Breakfast", type: "breakfast", defaultQuantity: dayState?.breakfast || 0 },
    2: { name: "Lunch", type: "lunch", defaultQuantity: dayState?.lunch || 0 },
    3: { name: "Soda", type: "soda", defaultQuantity: dayState?.soda || 0 },
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
    dispatch("saveDefault", { items: orderItems, location: currentLocation });
  }

  $: {
    if (dayState.order && dayState.order.orderLines && dayState.order.orderLines.length > 0) {
      orderItems = dayState.order.orderLines.map((line: OrderLine) => {
        const productInfo = itemProductMap[line.productId] || { name: `Product ${line.productId}`, type: 'lunch' as const };
        return {
          id: line.productId,
          name: productInfo.name,
          quantity: line.items,
          type: productInfo.type
        };
      }).filter(item => item.quantity > 0); 
    } else {
      orderItems = Object.entries(itemProductMap).map(([idStr, info]) => ({
          id: parseInt(idStr),
          name: info.name,
          quantity: dayState[info.type] || 0,
          type: info.type,
      }));
    }
  }

  function handleItemChange(itemId: number, change: number) {
    const itemIndex = orderItems.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
      const itemToChange = orderItems[itemIndex];
      const newQuantity = Math.max(0, itemToChange.quantity + change);

      orderItems[itemIndex] = { ...itemToChange, quantity: newQuantity };
      orderItems = [...orderItems]; // Trigger reactivity

      // Update dayState based on the type of item changed
      if (itemToChange.type === 'breakfast') {
        dayState.breakfast = newQuantity;
      } else if (itemToChange.type === 'lunch') {
        dayState.lunch = newQuantity;
      } else if (itemToChange.type === 'soda') {
        dayState.soda = newQuantity;
      }
      // No need to spread dayState for this, direct mutation is fine for svelte store updates if dayState is part of a store
      // or if it's a prop, the parent will be notified through binding if DayCard uses bind:dayState
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
    // Update dayState.location as well, so if the card is re-rendered with the same dayState object,
    // it reflects the latest selected location for this card instance.
    // This is important if the parent component relies on dayState.location for other logic or re-renders.
    if (dayState.location.name !== currentLocation.name || dayState.location.kitchen.id !== currentLocation.kitchen.id) {
        dayState = { ...dayState, location: currentLocation, kitchen: currentLocation.kitchen };
    }
  }

  $: if (dayState.location && (!currentLocation || dayState.location.name !== currentLocation.name)) {
    currentLocation = dayState.location;
  }

</script>

<div class="border rounded-lg p-4 shadow-md flex flex-col space-y-3 bg-white min-h-[300px]">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold">{getDayName(dayState.date)}</h3>
    <span class="text-sm text-gray-500">{getFormattedDate(dayState.date)}</span>
  </div>

  <LocationSelector 
    locations={locations} 
    selectedLocation={currentLocation} 
    on:locationChange={handleLocationChange} 
  />

  {#if isLoading}
    <div class="flex items-center justify-center h-full">
      <div class="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="flex flex-col justify-between flex-grow">
      <div>
        {#if dayState.hasOrder && dayState.order}
          {#if orderItems.length > 0}
            <ul class="mb-2 ml-4 space-y-1 text-sm list-disc list-inside">
              {#each orderItems as item}
                <li>{item.name}: {item.quantity}</li>
              {/each}
            </ul>
          {:else}
            <p class="mb-2 text-sm text-gray-500">No items in this order or items not recognized.</p>
          {/if}
        {:else}
          <div class="mb-3 space-y-2">
            {#each orderItems as item (item.id)}
              <div class="flex items-center justify-between">
                <span class="text-sm">{item.name}</span>
                <div class="flex items-center space-x-2">
                  <button 
                    on:click={() => handleItemChange(item.id, -1)} 
                    disabled={item.quantity <= 0}
                    class="px-2 py-0.5 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm"
                  >
                    -
                  </button>
                  <span class="w-5 text-sm text-center">{item.quantity}</span>
                  <button 
                    on:click={() => handleItemChange(item.id, 1)} 
                    class="px-2 py-0.5 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="pt-2 mt-auto space-y-2">
        {#if dayState.hasOrder}
          <button 
            on:click={cancelOrder} 
            class="w-full px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        {:else}
          <button 
            on:click={placeOrder} 
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400"
            disabled={isLoading || orderItems.every(i => i.quantity === 0) || !currentLocation}
          >
            {isLoading ? 'Placing...' : 'Place Order'}
          </button>
          <button 
            on:click={saveAsDefault} 
            class="w-full px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            disabled={isLoading || !currentLocation}
          >
            Save as Default
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
