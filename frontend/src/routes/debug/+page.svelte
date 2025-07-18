<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { locationsService } from '$lib/services/locationsService';
	import MainLayout from '$lib/components/templates/MainLayout.svelte';
	import Card from '$lib/components/atoms/Card.svelte';
	import { onMount } from 'svelte';

	// Data holders
	let locations: any[] = [];
	let loadingStatus = { locations: false };

	// Fetch locations
	async function fetchLocations() {
		loadingStatus.locations = true;
		try {
			locations = await locationsService.getLocations();
		} catch (error) {
			console.error('Error fetching locations:', error);
		} finally {
			loadingStatus.locations = false;
		}
	}

	// Initialize
	onMount(() => {
		fetchLocations();
	});
</script>

<MainLayout isAuthenticated={$authStore.isAuthenticated}>
	{#snippet children()}
		<div class="container mx-auto px-4 py-8">
			<h1 class="text-3xl font-bold text-slate-800 mb-6">Debug Console</h1>

			<!-- Auth Information -->
			<Card>
				{#snippet children()}
					<h2 class="text-xl font-semibold mb-3">Authentication</h2>
					<div class="bg-gray-100 p-4 rounded overflow-auto max-h-64">
						<pre class="whitespace-pre-wrap break-words text-sm">{JSON.stringify(
								$authStore,
								null,
								2
							)}</pre>
					</div>
				{/snippet}
			</Card>

			<!-- Locations Service -->
			<div class="mt-6">
				<Card>
					{#snippet children()}
						<h2 class="text-xl font-semibold mb-3">Locations Service</h2>
						<div class="mb-4 flex flex-wrap gap-2">
							<button
								class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
								on:click={fetchLocations}
								disabled={loadingStatus.locations}
							>
								{loadingStatus.locations ? 'Loading...' : 'Fetch Locations'}
							</button>
						</div>

						<div class="bg-gray-100 p-4 rounded overflow-auto max-h-64">
							<pre class="whitespace-pre-wrap break-words text-sm">{JSON.stringify(
									locations,
									null,
									2
								)}</pre>
						</div>
					{/snippet}
				</Card>
			</div>
		</div>
	{/snippet}
</MainLayout>
