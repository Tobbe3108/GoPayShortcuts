<script lang="ts">
  import type { Location } from "$lib/types/orders";
  import { createEventDispatcher } from "svelte";

  export let locations: Location[] = [];
  export let selectedLocation: Location | undefined = undefined; // Incoming prop

  const dispatch = createEventDispatcher<{ locationChanged: Location | undefined }>();

  // This will be two-way bound to the select element's value.
  // It's also updated when the selectedLocation prop changes.
  let componentSelectedLocationId: string = ""; // Default to empty string for "Select Location"

  // When the selectedLocation PROP changes, update our internal ID for the select control.
  $: {
    componentSelectedLocationId = selectedLocation?.id || ""; // If undefined, use ""
  }

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
  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
  bind:value={componentSelectedLocationId}
  on:change={handleUserSelectionChange}
>
  <option value="">Select Location</option> <!-- value="" matches componentSelectedLocationId = "" -->
  {#each locations as loc}
    <option value={loc.id}>{loc.name}</option>
  {/each}
</select>
