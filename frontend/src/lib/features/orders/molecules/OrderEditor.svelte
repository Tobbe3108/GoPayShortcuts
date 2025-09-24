<script lang="ts">
	import type { Order } from '../models/order';
	import type { OrderLine } from '../models/orderLine';
	import type { Product } from '$lib/features/products/product';
	import { productsService } from '$lib/features/products/productsService';

	import { onMount } from 'svelte';
	import Quantity from '$lib/components/atoms/Quantity.svelte';

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
		onOrderChange
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
		editableOrderlines = order?.orderlines ? order.orderlines.map((l) => ({ ...l })) : [];
	});

	const items = $derived(
		editableOrderlines.map((line: OrderLine) => {
			const product = products.find((p) => p.id === line.productId);
			return {
				id: line.productId,
				name: product?.name ?? (loading ? `Loading...` : `Unknown Product ${line.productId}`),
				quantity: line.quantity,
				price: line.price
			};
		})
	);

	const totalPrice = $derived(editableOrderlines.reduce((sum, l) => sum + l.price * l.quantity, 0));

	function handleQuantityChange(idx: number, newValue: number) {
		editableOrderlines[idx] = { ...editableOrderlines[idx], quantity: newValue };
		// Create a new order object to avoid mutating the prop
		const updatedOrder: Order = {
			...order,
			orderlines: editableOrderlines,
			totalPrice: totalPrice
		};
		if (onOrderChange) {
			onOrderChange(updatedOrder);
		}
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
					<td class="py-1 w-4/6">{item.name}</td>
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
								{item.quantity}
							{/if}
						</div>
					</td>
					<td class="py-1 text-right w-1/6">{formatPrice(item.price * item.quantity)}</td>
				</tr>
			{/each}
		</tbody>
		{#if showTotal}
			<tfoot>
				<tr class="font-semibold border-t border-slate-200">
					<td class="py-1" colspan="2">Total</td>
					<td class="py-1 text-right w-1/4">{formatPrice(totalPrice)}</td>
				</tr>
			</tfoot>
		{/if}
	</table>
</div>
