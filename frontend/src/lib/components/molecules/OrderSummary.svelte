<script lang="ts">
	interface OrderItem {
		id: string | number;
		name: string;
		quantity: number;
		price: number; // per item
	}

	interface Props {
		items: OrderItem[];
		currency?: string;
		showTotal?: boolean;
	}

	let { items = [], currency = 'kr', showTotal = true }: Props = $props();

	function formatPrice(amount: number) {
		return `${amount} ${currency}`;
	}

	const total = $derived(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
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
					<td class="py-1 text-right">{formatPrice(total)}</td>
				</tr>
			</tfoot>
		{/if}
	</table>
</div>
