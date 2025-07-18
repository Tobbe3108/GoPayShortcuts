<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { locationsService } from '$lib/services/locationsService';
	import { productsService } from '$lib/services/productsService';
	import { menuService } from '$lib/services/menuService';
	import MainLayout from '$lib/components/templates/MainLayout.svelte';
	import Card from '$lib/components/atoms/Card.svelte';
	import { onMount } from 'svelte';

	// Data holders
	let locations: any[] = [];
	let products: any[] = [];
	let menu: any[] = [];
	let loadingStatus = { locations: false, products: false, menu: false };

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

	// Fetch products
	async function fetchProducts() {
		loadingStatus.products = true;
		try {
			products = await productsService.getProducts();
		} catch (error) {
			console.error('Error fetching products:', error);
		} finally {
			loadingStatus.products = false;
		}
	}

	// Fetch menu
	async function fetchMenu() {
		loadingStatus.menu = true;
		try {
			menu = await menuService.getMenu();
		} catch (error) {
			console.error('Error fetching menu:', error);
		} finally {
			loadingStatus.menu = false;
		}
	}

	// Initialize
	onMount(() => {
		fetchLocations();
		fetchProducts();
		fetchMenu();
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

			<!-- Products Service -->
			<div class="mt-6">
				<Card>
					{#snippet children()}
						<h2 class="text-xl font-semibold mb-3">Products Service</h2>
						<div class="mb-4 flex flex-wrap gap-2">
							<button
								class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
								on:click={fetchProducts}
								disabled={loadingStatus.products}
							>
								{loadingStatus.products ? 'Loading...' : 'Fetch Products'}
							</button>
						</div>

						<div class="bg-gray-100 p-4 rounded overflow-auto max-h-64">
							<pre class="whitespace-pre-wrap break-words text-sm">{JSON.stringify(
									products,
									null,
									2
								)}</pre>
						</div>
					{/snippet}
				</Card>
			</div>

			<!-- Menu Service -->
			<div class="mt-6">
				<Card>
					{#snippet children()}
						<h2 class="text-xl font-semibold mb-3">Menu Service</h2>
						<div class="mb-4 flex flex-wrap gap-2">
							<button
								class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
								on:click={fetchMenu}
								disabled={loadingStatus.menu}
							>
								{loadingStatus.menu ? 'Loading...' : 'Fetch Menu'}
							</button>
						</div>

						<div class="bg-gray-100 p-4 rounded overflow-auto max-h-64">
							<pre class="whitespace-pre-wrap break-words text-sm">{JSON.stringify(
									menu,
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
