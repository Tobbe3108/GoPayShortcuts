<script lang="ts">
	import type { Order } from '../models/order';
	import type { OrderLine } from '../models/orderLine';
	import type { Product } from '$lib/features/products/product';
	import { productsService } from '$lib/features/products/productsService';

	interface Props {
		order: Order;
		currency?: string;
		showTotal?: boolean;
	}

	let { order, currency = 'kr', showTotal = true }: Props = $props();

	let products = $state<Product[]>([]);
	let loading = $state(true);
	$effect(() => {
		(async () => {
			products = await productsService.getProducts();
			loading = false;
		})();
	});

	// Map orderlines to items for display
	const items = $derived(
		order?.orderlines?.map((line: OrderLine) => {
			const product = products.find((p) => p.id === line.productId);
			return {
				id: line.productId,
				name: product?.name ?? (loading ? `Loading...` : `Unknown Product ${line.productId}`),
				quantity: line.quantity,
				price: line.price
			};
		}) ?? []
	);

	function formatPrice(amount: number) {
		return `${amount} ${currency}`;
	}
</script>

<div class="w-full">
	<table class="w-full text-left text-sm">
		<tbody>
			{#each items as item}
				<tr>
					<td class="py-1">{item.name}</td>
					<td class="py-1 text-center">{item.quantity}</td>
					<td class="py-1 text-right">{formatPrice(item.price * item.quantity)}</td>
				</tr>
			{/each}
		</tbody>
		{#if showTotal}
			<tfoot>
				<tr class="font-semibold border-t border-slate-200">
					<td class="py-1" colspan="2">Total</td>
					<td class="py-1 text-right">{formatPrice(order.totalPrice ?? 0)}</td>
				</tr>
			</tfoot>
		{/if}
	</table>
</div>
