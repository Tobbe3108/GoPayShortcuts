<script lang="ts">
	import type { Product } from '$lib/features/products/product';
	import { productsService } from '$lib/features/products/productsService';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import Quantity from '$lib/components/atoms/Quantity.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import type { SimplifiedOrder } from '../models/SimplifiedOrder';
	import type { OrderLine } from '../models/orderLine';
	import { slide } from 'svelte/transition';

	interface Props {
		order: SimplifiedOrder;
		editMode?: boolean;
		appendOnly?: boolean;
		originalQuantities?: Map<number, number>;
		currency?: string;
		showTotal?: boolean;
		onOrderChange?: (order: SimplifiedOrder) => void;
	}

	let {
		order,
		editMode = false,
		appendOnly = false,
		originalQuantities = new Map(),
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

	// Helper to detect guest products (supports both 'gæst' and 'gaest')
	function isGuestProduct(name: string) {
		const n = name.toLowerCase();
		return n.includes('gæst') || n.includes('gaest');
	}

	// Guest items derived from products + editableOrderlines regardless of quantity (so users can add them)
	const guestItems = $derived(
		products
			.map((product, idx) => {
				if (!isGuestProduct(product.name)) return null;
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
			.filter((it) => it !== null) as Array<{
			id: number;
			name: string;
			quantity: number;
			price: number;
		}>
	);

	const guestQuantityTotal = $derived(guestItems.reduce((sum, i) => sum + i.quantity, 0));

	// Collapsed state: false if guest items have quantity > 0, else true (user can toggle)
	let guestCollapsed = $derived(guestQuantityTotal === 0);

	// Main items exclude guest products when editing (guest items live in their own collapsible section).
	// When not editing, show only selected (quantity > 0) items and include guest items inline (simpler read-only view).
	const items = $derived(
		products
			.map((product, idx) => {
				if (editMode && isGuestProduct(product.name)) return null; // exclude in edit mode list
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
			.filter((it) => it !== null)
			.filter((it) => (editMode ? true : it.quantity > 0)) as Array<{
			id: number;
			name: string;
			quantity: number;
			price: number;
		}>
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

	function handleGuestQuantityChange(productId: number, newValue: number) {
		const idx = products.findIndex((p) => p.id === productId);
		if (idx === -1) return;
		handleQuantityChange(idx, newValue);
	}

	function formatPrice(amount: number) {
		return `${amount} ${currency}`;
	}
</script>

{#if !loading}
	<div class="w-full overflow-x-auto">
		<div class="flex flex-col w-full text-sm">
			{#if !items || items.length === 0}
				<Label variant="muted" size="sm" className="text-center">{$_('orders.noProductsFound')}</Label>
			{/if}
			{#each items as item, idx}
				<div class="flex items-center justify-center py-1 gap-1">
					<Label className="text-left grow truncate">{item.name}</Label>
					<div class="flex min-w-11 justify-center">
						{#if editMode}
							<Quantity
								value={item.quantity}
								min={appendOnly ? (originalQuantities.get(item.id) ?? 0) : 0}
								max={99}
								showLockWhenAtMin={appendOnly}
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
						>{$_('orders.unknownProducts')}</Label
					>
					{#each unmatchedOrderlines as l}
						<div class="flex items-center justify-center py-1 gap-1 opacity-75">
							<Label className="text-left grow truncate">{$_('orders.product')} #{l.productId}</Label>
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

			{#if editMode && guestItems.length > 0}
				<div class="flex flex-col items-center mt-2">
					<button
						class="flex items-center gap-1 cursor-pointer select-none focus:outline-none"
						type="button"
						aria-expanded={!guestCollapsed}
						aria-controls="guest-items-content"
						onclick={() => (guestCollapsed = !guestCollapsed)}
					>
						<Label size="xs" className="tracking-wide cursor-pointer">{$_('orders.guestItems')}</Label>
						<Icon name={guestCollapsed ? 'open' : 'collapse'} size={10} />
					</button>
					{#if !guestCollapsed}
						<div id="guest-items-content" class="w-full">
							<div transition:slide|local>
								{#each guestItems as g}
									<div class="flex items-center justify-center py-1 gap-1">
										<Label className="text-left grow truncate">{g.name}</Label>
										<div class="flex min-w-11 justify-center">
											<Quantity
												value={g.quantity}
												min={appendOnly ? (originalQuantities.get(g.id) ?? 0) : 0}
												max={99}
												showLockWhenAtMin={appendOnly}
												onChange={(v) => handleGuestQuantityChange(g.id, v)}
											/>
										</div>
										<Label className="text-right flex-none w-auto min-w-9"
											>{formatPrice(g.price * g.quantity)}</Label
										>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
			{#if showTotal}
				<div class="flex justify-between border-t border-slate-200 mt-2 pt-2">
					<Label className="font-semibold">{$_('orders.total')}</Label>

					<Label className="font-semibold text-right">{formatPrice(totalPrice)}</Label>
				</div>
			{/if}
		</div>
	</div>
{/if}
