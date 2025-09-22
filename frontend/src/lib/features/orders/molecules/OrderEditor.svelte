<script lang="ts">
	import type { Order } from '../models/order';
	import type { OrderLine } from '../models/orderLine';
	import type { Product } from '$lib/features/products/product';
	import { productsService } from '$lib/features/products/productsService';
	import Quantity from '$lib/components/atoms/Quantity.svelte';

	interface Props {
		order: Order;
		editMode?: boolean;
		currency?: string;
		showTotal?: boolean;
	}

	let { order, editMode = false, currency = 'kr', showTotal = true }: Props = $props();

	$effect(() => {
		loadProducts();
		UpdateOrderWhenEditableOrderlinesChange();
	});

	let products = $state<Product[]>([]);
	let loading = $state(true);
	function loadProducts() {
		(async () => {
			products = await productsService.getProducts();
			loading = false;
		})();
	}

	let editableOrderlines = $state<OrderLine[]>(
		order?.orderlines ? order.orderlines.map((l) => ({ ...l })) : []
	);

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

	function UpdateOrderWhenEditableOrderlinesChange() {
		if (!order && !editableOrderlines) return;

		order.orderlines = editableOrderlines;
		order.totalPrice = editableOrderlines.reduce((sum, l) => sum + l.price * l.quantity, 0);
	}

	function formatPrice(amount: number) {
		return `${amount} ${currency}`;
	}

	function handleQuantityChange(idx: number, newValue: number) {
		editableOrderlines[idx] = { ...editableOrderlines[idx], quantity: newValue };
	}
</script>

<div class="w-full">
	<table class="w-full text-left text-sm">
		<tbody>
			{#each items as item, idx}
				<tr>
					<td class="py-1">{item.name}</td>
					<td class="py-1 text-center w-1/4">
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
					</td>
					<td class="py-1 text-right">{formatPrice(item.price * item.quantity)}</td>
				</tr>
			{/each}
		</tbody>
		{#if showTotal}
			<tfoot>
				<tr class="font-semibold border-t border-slate-200">
					<td class="py-1" colspan="2">Total</td>
					<td class="py-1 text-right w-1/4">{formatPrice(order.totalPrice ?? 0)}</td>
				</tr>
			</tfoot>
		{/if}
	</table>
</div>
