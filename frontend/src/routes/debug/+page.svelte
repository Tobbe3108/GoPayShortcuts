<script lang="ts">
	import { authStore } from '$lib/features/auth/store';
	import { locationsService } from '$lib/features/locations/locationsService';
	import { productsService } from '$lib/features/products/productsService';
	import { menuService } from '$lib/features/menu/menuService';
	import { ordersService } from '$lib/features/orders/ordersService';
	import MainLayout from '$lib/components/templates/MainLayout.svelte';
	import type { UpdateDayRequest } from '$lib/features/orders/models/updateDayRequest';

	import Card from '$lib/components/atoms/Card.svelte';
	import { onMount } from 'svelte';

	// Data holders
	let locations: any[] = [];
	let products: any[] = [];
	let menu: any[] = [];
	let orders: any[] = [];
	let loadingStatus = {
		locations: false,
		products: false,
		menu: false,
		orders: false,
		updateDay: false
	};
	let startDate: Date | undefined = undefined;
	let endDate: Date | undefined = undefined;

	// Update Day debug state
	let updateDayKitchenId: number | '' = '';
	let updateDayDate: string = new Date().toISOString().split('T')[0];
	let desiredOrders: Array<{ productId: number | ''; quantity: number | '' }> = [
		{ productId: '', quantity: '' }
	];
	let updateDayResult: UpdateDayResponse | null = null;
	let updateDayError: string | null = null;

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

	// Fetch orders
	async function fetchOrders() {
		loadingStatus.orders = true;
		try {
			orders = await ordersService.listOrders(startDate!, endDate!);
		} catch (error) {
			console.error('Error fetching orders:', error);
		} finally {
			loadingStatus.orders = false;
		}
	}

	async function fetchCurrentWeekOrders() {
		loadingStatus.orders = true;
		try {
			orders = await ordersService.getOrdersForCurrentWeek();
		} catch (error) {
			console.error('Error fetching current week orders:', error);
		} finally {
			loadingStatus.orders = false;
		}
	}

	// Update Day handler
	async function runUpdateDay() {
		updateDayResult = null;
		updateDayError = null;
		loadingStatus.updateDay = true;
		try {
			// Basic validation
			if (updateDayKitchenId === '' || !updateDayDate) {
				throw new Error('Kitchen ID and Date are required');
			}
			const sanitizedOrders = desiredOrders
				.filter((o) => o.productId !== '' && o.quantity !== '')
				.map((o) => ({ productId: Number(o.productId), quantity: Number(o.quantity) }))
				.filter(
					(o) => Number.isFinite(o.productId) && Number.isFinite(o.quantity) && o.quantity > 0
				);

			const req: UpdateDayRequest = {
				kitchenId: Number(updateDayKitchenId),
				date: updateDayDate,
				desiredOrders: sanitizedOrders
			};

			const res = await ordersService.updateDay(req);
			updateDayResult = res;
		} catch (err: any) {
			console.error('Error updating day:', err);
			updateDayError = err?.message ?? String(err);
		} finally {
			loadingStatus.updateDay = false;
		}
	}

	function addDesiredOrderRow() {
		desiredOrders = [...desiredOrders, { productId: '', quantity: '' }];
	}

	function removeDesiredOrderRow(index: number) {
		desiredOrders = desiredOrders.filter((_, i) => i !== index);
	}

	// Initialize
	onMount(() => {
		fetchCurrentWeekOrders();
		fetchLocations();
		fetchProducts();
		fetchMenu();
	});
</script>

<MainLayout isAuthenticated={$authStore.isAuthenticated}>
	{#snippet children()}
		<div class="container mx-auto px-4 py-8">
			<div class="mb-6 flex gap-4">
				<a href="/debug/atoms" class="text-blue-600 hover:underline">Atoms Debug</a>
				<a href="/debug/molecules" class="text-blue-600 hover:underline">Molecules Debug</a>
				<a href="/debug/organisms" class="text-blue-600 hover:underline">Organisms Debug</a>
				<a href="/debug/templates" class="text-blue-600 hover:underline">Templates Debug</a>
				<a href="/debug" class="text-blue-900 font-bold underline">Main Debug</a>
			</div>
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

			<!-- Orders Service -->
			<div class="mt-6">
				<Card>
					{#snippet children()}
						<h2 class="text-xl font-semibold mb-3">Orders Service</h2>
						<div class="mb-4">
							<div class="flex flex-wrap gap-4 mb-4 items-end">
								<div>
									<label for="startDate" class="block text-sm font-medium text-gray-700"
										>Start Date</label
									>
									<input
										id="startDate"
										type="date"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										bind:value={startDate}
									/>
								</div>
								<div>
									<label for="endDate" class="block text-sm font-medium text-gray-700"
										>End Date</label
									>
									<input
										id="endDate"
										type="date"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										bind:value={endDate}
									/>
								</div>
								<button
									class="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
									on:click={fetchOrders}
									disabled={loadingStatus.orders}
								>
									{loadingStatus.orders ? 'Loading...' : 'Fetch Orders'}
								</button>
								<button
									class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
									on:click={fetchCurrentWeekOrders}
									disabled={loadingStatus.orders}
								>
									{loadingStatus.orders ? 'Loading...' : 'Current Week Orders'}
								</button>
							</div>
						</div>

						<div class="bg-gray-100 p-4 rounded overflow-auto max-h-64">
							<pre class="whitespace-pre-wrap break-words text-sm">{JSON.stringify(
									orders,
									null,
									2
								)}</pre>
						</div>
					{/snippet}
				</Card>
			</div>

			<!-- Update Day (Orders) -->
			<div class="mt-6">
				<Card>
					{#snippet children()}
						<h2 class="text-xl font-semibold mb-3">Orders Service – Update Day</h2>
						<div class="space-y-4">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label class="block text-sm font-medium text-gray-700" for="update-kitchen-id"
										>Kitchen ID</label
									>
									<input
										id="update-kitchen-id"
										type="number"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										bind:value={updateDayKitchenId}
										min="0"
										placeholder="e.g. 1"
									/>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-700" for="update-date"
										>Date</label
									>
									<input
										id="update-date"
										type="date"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										bind:value={updateDayDate}
									/>
								</div>
							</div>

							<div>
								<fieldset class="border border-gray-200 rounded p-3">
									<legend class="px-1 text-sm font-medium text-gray-700">Desired Orders</legend>
									<div class="flex items-center justify-between mb-2">
										<div class="text-xs text-gray-500">Enter product IDs and quantities</div>
										<button
											class="px-3 py-1 text-sm bg-slate-700 text-white rounded hover:bg-slate-800"
											on:click={addDesiredOrderRow}
										>
											+ Add Row
										</button>
									</div>

									<div class="space-y-2">
										{#each desiredOrders as row, i}
											<div class="grid grid-cols-8 gap-2 items-end">
												<div class="col-span-3">
													<label class="block text-xs text-gray-600" for={`desired-product-${i}`}
														>Product ID</label
													>
													<input
														id={`desired-product-${i}`}
														type="number"
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														bind:value={row.productId}
														min="0"
														placeholder="e.g. 101"
													/>
												</div>
												<div class="col-span-3">
													<label class="block text-xs text-gray-600" for={`desired-quantity-${i}`}
														>Quantity</label
													>
													<input
														id={`desired-quantity-${i}`}
														type="number"
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														bind:value={row.quantity}
														min="0"
														placeholder="e.g. 2"
													/>
												</div>
												<div class="col-span-2 flex justify-end">
													<button
														class="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
														on:click={() => removeDesiredOrderRow(i)}
													>
														Remove
													</button>
												</div>
											</div>
										{/each}
									</div>
								</fieldset>
							</div>

							<div class="flex gap-2">
								<button
									class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
									on:click={runUpdateDay}
									disabled={loadingStatus.updateDay}
								>
									{loadingStatus.updateDay ? 'Updating...' : 'Run Update Day'}
								</button>
							</div>

							{#if updateDayError}
								<div class="mt-3 text-sm text-red-700 bg-red-100 p-2 rounded">{updateDayError}</div>
							{/if}

							<div class="bg-gray-100 p-4 rounded overflow-auto max-h-64 mt-4">
								<pre class="whitespace-pre-wrap break-words text-sm">{JSON.stringify(
										updateDayResult,
										null,
										2
									)}</pre>
							</div>
						</div>
					{/snippet}
				</Card>
			</div>
		</div>
	{/snippet}
</MainLayout>
