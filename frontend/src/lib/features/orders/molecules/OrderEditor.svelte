<script lang="ts">
	import type { Product } from '$lib/features/products/product';
	import { productsService } from '$lib/features/products/productsService';
	import { onMount } from 'svelte';
	import Quantity from '$lib/components/atoms/Quantity.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import type { SimplifiedOrder } from '../models/SimplifiedOrder';
	import type { OrderLine } from '../models/orderLine';

	interface Props {
		order: SimplifiedOrder;
		editMode?: boolean;
		currency?: string;
		showTotal?: boolean;
		onOrderChange?: (order: SimplifiedOrder) => void;
	}

	let {
		order,
		editMode = false,
		currency = 'kr',
		showTotal = true,
		onOrderChange = undefined
	}: Props = $props();

	let products = $state<Product[]>([]);
	let loading = $state(true);

	onMount(async () => {
		await productsService
			.getProducts(order.kitchenId)
			.then((res) => (products = res))
			.finally(() => (loading = false));
	});

	let editableOrderlines = $state<OrderLine[]>([]);
	$effect(() => {
		editableOrderlines = products.map((product) => {
			const existing = order?.orderlines?.find((l) => l.productId === product.id);
			return {
				productId: product.id,
				quantity: existing ? existing.quantity : 0,
				price: product.price
			};
		});
	});

	const items = $derived(
		products.map((product, idx) => {
			const line = editableOrderlines[idx] ?? {
				productId: product.id,
				quantity: 0,
				price: product.price
			};
			return {
				id: product.id,
				name: product.name,
				quantity: line.quantity,
				price: product.price
			};
		})
	);

	const totalPrice = $derived(editableOrderlines.reduce((sum, l) => sum + l.price * l.quantity, 0));

	// Orderlines whose product ids are not present in the current products list (can happen if backend
	// returns legacy product ids). We surface them so quantities aren't silently hidden.
	const unmatchedOrderlines = $derived(
		order?.orderlines
			? order.orderlines.filter((l) => !products.some((p) => p.id === l.productId))
			: []
	);

	function handleQuantityChange(idx: number, newValue: number) {
		editableOrderlines[idx] = { ...editableOrderlines[idx], quantity: newValue };
		onOrderChange?.({
			...order,
			orderlines: [...editableOrderlines]
		});
	}

	function formatPrice(amount: number) {
		return `${amount} ${currency}`;
	}
</script>

{#if !loading}
	<div class="w-full overflow-x-auto">
		<div class="flex flex-col w-full text-sm">
			{#if !items || items.length === 0}
				<Label variant="muted" size="sm" className="text-center">Ingen produkter fundet...</Label>
			{/if}
			{#each items as item, idx}
				<div class="flex items-center justify-center py-1 gap-1">
					<Label className="text-left grow truncate">{item.name}</Label>
					<div class="flex min-w-11 justify-center">
						{#if editMode}
							<Quantity
								value={item.quantity}
								min={0}
								max={99}
								onChange={(v) => handleQuantityChange(idx, v)}
							/>
						{:else}
							<Label>{item.quantity}</Label>
						{/if}
					</div>

					<Label className="text-right flex-none w-auto min-w-9"
						>{formatPrice(item.price * item.quantity)}</Label
					>
				</div>
			{/each}

			{#if unmatchedOrderlines.length > 0}
				<div class="mt-2 border-t border-slate-200 pt-2">
					<Label variant="muted" size="xs" className="block mb-1"
						>Ukendte produkter (ID mismatch)</Label
					>
					{#each unmatchedOrderlines as l}
						<div class="flex items-center justify-center py-1 gap-1 opacity-75">
							<Label className="text-left grow truncate">Produkt #{l.productId}</Label>
							<div class="flex min-w-11 justify-center">
								<Label>{l.quantity}</Label>
							</div>
							<Label className="text-right flex-none w-auto min-w-9"
								>{formatPrice(l.price * l.quantity)}</Label
							>
						</div>
					{/each}
				</div>
			{/if}
			{#if showTotal}
				<div class="flex justify-between border-t border-slate-200 mt-2 pt-2">
					<Label className="font-semibold">Total</Label>

					<Label className="font-semibold text-right">{formatPrice(totalPrice)}</Label>
				</div>
			{/if}
		</div>
	</div>
{/if}
