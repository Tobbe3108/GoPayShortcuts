<script lang="ts">
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import TodaysMenu from '$lib/features/menu/molecules/TodaysMenu.svelte';
	import { endOfWeek, isPast, isToday, startOfWeek } from 'date-fns';
	import {
		listOrders,
		ordersByDay,
		handleOrderChange,
		handleCancel,
		updateOrderForKitchen,
		type TemplateOrder
	} from '$lib/features/orders/orderUtils';
	import Card from '$lib/components/atoms/Card.svelte';

	type DayViewProps = {
		date: Date;
	};

	let { date }: DayViewProps = $props();

	let selectedDate = $derived(date);
	let weekStart = $derived(startOfWeek(selectedDate, { weekStartsOn: 1 }));
	let weekEnd = $derived(endOfWeek(selectedDate, { weekStartsOn: 1 }));

	let orders: Record<string, TemplateOrder[]> = $state({});

	$effect(() => {
		listOrders(weekStart, weekEnd).then((listed) => (orders = listed));
	});
</script>

<div class="flex flex-col space-y-4 w-full">
	<TodaysMenu date={selectedDate} />
	{#if isPast(selectedDate) && !isToday(selectedDate) && [...ordersByDay(orders, selectedDate)].length === 0}
		<Card>
			<div class="text-xs text-gray-400 text-center">No orders for this day</div>
		</Card>
	{/if}
	{#each ordersByDay(orders, selectedDate) as order (order.kitchenId)}
		<OrderCard
			{order}
			isEditing={order.tempOrder}
			onOrderChange={(newOrderState) => handleOrderChange(orders, newOrderState)}
			onOrderCancel={(selectedDate, kitchenId) => handleCancel(orders, selectedDate, kitchenId)}
		/>
	{/each}
	<AddLocationCard
		date={selectedDate}
		newOrder={(newOrder) => updateOrderForKitchen(orders, { ...newOrder, tempOrder: true })}
		locationsWithOrders={[...ordersByDay(orders, selectedDate)].map((o) => o.kitchenId)}
	/>
</div>
