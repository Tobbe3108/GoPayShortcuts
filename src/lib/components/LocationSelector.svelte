<script lang="ts">
  import type { Location } from "../types/orders";
  import { createEventDispatcher } from "svelte";

  export let locations: Location[];
  export let selectedLocation: Location | undefined = undefined;

  const dispatch = createEventDispatcher();

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const locationName = target.value;
    const newSelectedLocation = locations.find(loc => loc.name === locationName);
    if (newSelectedLocation) {
      selectedLocation = newSelectedLocation;
      dispatch("locationChange", newSelectedLocation);
    }
  }
</script>

{#if locations && locations.length > 0}
  <div class="mb-4">
    <label for="location-select" class="block text-sm font-medium text-gray-700 mb-1">Select Location:</label>
    <select
      id="location-select"
      class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      value={selectedLocation?.name}
      on:change={handleChange}
    >
      <option value="" disabled selected={selectedLocation === undefined}>Select a location</option>
      {#each locations as location (location.name)}
        <option value={location.name}>{location.name} (Kitchen: {location.kitchen.name})</option>
      {/each}
    </select>
  </div>
{:else}
  <p class="text-sm text-gray-500">Loading locations...</p>
{/if}
