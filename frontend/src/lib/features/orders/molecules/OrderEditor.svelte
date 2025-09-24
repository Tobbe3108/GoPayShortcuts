<script lang="ts">
	import type { Order } from '../models/order';
	import type { Product } from '$lib/features/products/product';
	import { productsService } from '$lib/features/products/productsService';
	import type { OrderLine } from '../models/orderLine';
	import { onMount } from 'svelte';
	import Quantity from '$lib/components/atoms/Quantity.svelte';
	import Label from '$lib/components/atoms/Label.svelte';

	interface Props {
		order: Order;
		editMode?: boolean;
		currency?: string;
		showTotal?: boolean;
		onOrderChange?: (order: Order) => void;
	}

	let {
		order,
		editMode = false,
		currency = 'kr',
		showTotal = true,
		onOrderChange = undefined
	}: Props = $props();

	onMount(() => {
		loadProducts();
	});

	let products = $state<Product[]>([]);
	let loading = $state(true);
	function loadProducts() {
		(async () => {
			products = await productsService.getProducts();
			loading = false;
		})();
	}

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

	function handleQuantityChange(idx: number, newValue: number) {
		editableOrderlines[idx] = { ...editableOrderlines[idx], quantity: newValue };
		onOrderChange?.({
			...order,
			orderlines: [...editableOrderlines],
			totalPrice
		});
	}

	function formatPrice(amount: number) {
		return `${amount} ${currency}`;
	}
</script>

<div class="w-full">
	<table class="w-full text-left text-sm">
		<tbody>
			{#each items as item, idx}
				<tr>
					<td class="py-1 w-4/6">
						<Label>{item.name}</Label>
					</td>
					<td class="py-1 w-1/6">
						<div class="flex justify-center">
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
					</td>
					<td class="py-1 text-right w-1/6">
						<Label>{formatPrice(item.price * item.quantity)}</Label>
					</td>
				</tr>
			{/each}
		</tbody>
		{#if showTotal}
			<tfoot>
				<tr class="border-t border-slate-200">
					<td class="py-1" colspan="2">
						<Label className="font-semibold">Total</Label>
					</td>
					<td class="py-1 text-right w-1/4">
						<Label className="font-semibold">{formatPrice(totalPrice)}</Label>
					</td>
				</tr>
			</tfoot>
		{/if}
	</table>
</div>
