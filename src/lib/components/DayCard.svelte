<script lang="ts">
  import type { DayOrderState, Location, OrderItemData, OrderLine } from "../types/orders";
  import { createEventDispatcher } from "svelte";

  export let dayState: DayOrderState;
  export let locations: Location[];
  export let selectedLocation: Location; // This is the location context for this card, from dayState.location

  const dispatch = createEventDispatcher();

  let isLoading = false;
  let orderItems: OrderItemData[] = [];

  // Placeholder for product ID to type/name mapping
  // This should ideally come from a service or config, or be passed as a prop
  const itemProductMap: Record<number, { name: string, type: 'breakfast' | 'lunch' | 'soda', defaultQuantity?: number }> = {
    1: { name: "Breakfast", type: "breakfast", defaultQuantity: dayState?.breakfast || 0 },
    2: { name: "Lunch", type: "lunch", defaultQuantity: dayState?.lunch || 0 },
    3: { name: "Soda", type: "soda", defaultQuantity: dayState?.soda || 0 },
  };

  function placeOrder() {
    if (orderItems.every(item => item.quantity === 0)) {
      alert("Cannot place an empty order.");
      return;
    }
    isLoading = true;
    // Simulate API call
    setTimeout(() => {
      dispatch("orderPlaced", { date: dayState.date, items: orderItems.filter(i => i.quantity > 0) });
      isLoading = false;
    }, 1000);
  }

  function cancelOrder() {
    isLoading = true;
    // Simulate API call
    setTimeout(() => {
      dispatch("orderCancelled", { date: dayState.date });
      isLoading = false;
    }, 1000);
  }

  function saveAsDefault() {
    dispatch("saveDefault", { items: orderItems, location: selectedLocation });
  }

  // Reactive statement to update orderItems when dayState changes
  $: {
    if (dayState.order && dayState.order.orderLines && dayState.order.orderLines.length > 0) {
      orderItems = dayState.order.orderLines.map((line: OrderLine) => {
        const productInfo = itemProductMap[line.productId] || { name: `Product ${line.productId}`, type: 'lunch' as const }; // Fallback
        return {
          id: line.productId,
          name: productInfo.name,
          quantity: line.items,
          type: productInfo.type
        };
      }).filter(item => item.quantity > 0); 
      // If, after mapping, orderItems is empty (e.g. all products unknown or 0 quantity), 
      // it will show as "No items in this order" or similar in the template.
    } else {
      // Initialize for "No Order" state
      // Use quantities from dayState (which are from defaults or 0 if no defaults)
      orderItems = Object.entries(itemProductMap).map(([idStr, info]) => ({
          id: parseInt(idStr),
          name: info.name,
          quantity: dayState[info.type] || 0, // Use dayState.breakfast, dayState.lunch, dayState.soda
          type: info.type,
      }));
    }
  }

  function handleItemChange(itemId: number, change: number) {
    const itemIndex = orderItems.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
      const currentQuantity = orderItems[itemIndex].quantity;
      const newQuantity = Math.max(0, currentQuantity + change);
      orderItems[itemIndex] = { ...orderItems[itemIndex], quantity: newQuantity };
      orderItems = [...orderItems]; // Trigger reactivity for Svelte's #each block
    }
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const getFormattedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
</script>

<div class="border rounded-lg p-4 shadow-md flex flex-col space-y-3 bg-white min-h-[300px]">
  <div class="flex justify-between items-center">
    <h3 class="text-lg font-semibold">{getDayName(dayState.date)}</h3>
    <span class="text-sm text-gray-500">{getFormattedDate(dayState.date)}</span>
  </div>

  {#if isLoading}
    <div class="flex justify-center items-center h-full">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  {:else}
    <div class="flex flex-col flex-grow justify-between">
      <div>
        <p class="text-sm mb-1">
          Status: <span class="font-medium">{dayState.hasOrder ? "Order Placed" : "No Order"}</span>
        </p>
        <p class="text-sm mb-2">
          Location: <span class="font-medium">{selectedLocation.name}</span> (Kitchen: {selectedLocation.kitchen.name})
        </p>

        {#if dayState.hasOrder && dayState.order}
          {#if orderItems.length > 0}
            <ul class="list-disc list-inside ml-4 text-sm space-y-1 mb-2">
              {#each orderItems as item}
                <li>{item.name}: {item.quantity}</li>
              {/each}
            </ul>
          {:else}
            <p class="text-sm text-gray-500 mb-2">No items in this order or items not recognized.</p>
          {/if}
        {:else}
          <div class="space-y-2 mb-3">
            {#each orderItems as item (item.id)}
              <div class="flex justify-between items-center">
                <span class="text-sm">{item.name}</span>
                <div class="flex items-center space-x-2">
                  <button 
                    on:click={() => handleItemChange(item.id, -1)} 
                    disabled={item.quantity <= 0}
                    class="px-2 py-0.5 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm"
                  >
                    -
                  </button>
                  <span class="text-sm w-5 text-center">{item.quantity}</span>
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

      <div class="mt-auto pt-2 space-y-2">
        {#if dayState.hasOrder}
          <button
            on:click={cancelOrder}
            class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded text-sm"
          >
            Cancel Order
          </button>
        {:else}
          <button
            on:click={placeOrder}
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm"
            disabled={orderItems.every(item => item.quantity === 0)}
          >
            Order Now
          </button>
          <button
            on:click={saveAsDefault}
            class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded text-sm"
          >
            Save as Default
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
