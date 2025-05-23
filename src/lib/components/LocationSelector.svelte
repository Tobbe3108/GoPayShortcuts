<script lang="ts">  import type { Location } from "$lib/types/orders";
  import { createEventDispatcher } from "svelte";
  const { locations = [], selectedLocation = undefined } = $props<{
    locations?: Location[];
    selectedLocation?: Location;
  }>();

  const dispatch = createEventDispatcher<{ locationChanged: Location | undefined }>();

  // This will be two-way bound to the select element's value.
  // It's also updated when the selectedLocation prop changes.
  let componentSelectedLocationId = $state(""); // Default to empty string for "Select Location"

  // When the selectedLocation PROP changes, update our internal ID for the select control.
  $effect(() => {
    componentSelectedLocationId = selectedLocation?.id || ""; // If undefined, use ""
  });
  // When the user interacts with the select, this function is called AFTER
  // componentSelectedLocationId is updated by bind:value.
  function handleUserSelectionChange() {
    const newSelectedLocationObject = componentSelectedLocationId
      ? locations.find(l => l.id === componentSelectedLocationId)
      : undefined;
    dispatch("locationChanged", newSelectedLocationObject);
  }
</script>

<select
  id="location-selector"
  class="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  bind:value={componentSelectedLocationId}
  on:change={handleUserSelectionChange}
>
  <option value="">Select Location</option> <!-- value="" matches componentSelectedLocationId = "" -->
  {#each locations as loc}
    <option value={loc.kitchenId}>{loc.name}</option>
  {/each}
</select>
