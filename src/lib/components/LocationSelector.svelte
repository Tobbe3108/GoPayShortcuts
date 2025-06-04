<script lang="ts">
  import type { Location } from "$lib/types/orders";

  let { locations, selectedLocation, onLocationChange } = $props<{
    locations: Location[];
    selectedLocation: Location | null;
    onLocationChange: (location: Location | null) => void;
  }>();

  // This function will be called when the user selects a new option.
  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;

    if (selectedId === "") {
      onLocationChange(null);
    } else {
      const foundLocation = locations.find(
        (loc: Location) => loc.kitchenId.toString() === selectedId
      );
      if (foundLocation) {
        onLocationChange(foundLocation);
      }
    }
  }
</script>

{#if locations && locations.length > 0}
  <select    class="w-full max-w-xs select select-bordered"
    value={selectedLocation ? selectedLocation.kitchenId.toString() : ""}
    onchange={handleChange}
  >
    <option value="">Vælg lokation</option>
    {#each locations as loc (loc.kitchenId)}
      <option value={loc.kitchenId.toString()}>{loc.displayName}</option>
    {/each}
  </select>
{:else}
  <p>Ingen lokationer tilgængelige.</p>
{/if}
