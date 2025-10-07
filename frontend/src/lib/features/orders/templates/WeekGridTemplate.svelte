<script lang="ts">
	import DayHeader from '$lib/components/molecules/DayHeader.svelte';
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import TodaysMenu from '$lib/features/menu/molecules/TodaysMenu.svelte';
	import { startOfWeek, endOfWeek, addDays, isPast, isToday } from 'date-fns';
	import {
		listOrders,
		ordersByDay,
		handleOrderChange,
		handleCancel,
		updateOrderForKitchen,
		type TemplateOrder
	} from '$lib/features/orders/orderUtils';
	import Card from '$lib/components/atoms/Card.svelte';

	type WeekGridProps = {
		date: Date;
	};

	let { date }: WeekGridProps = $props();

	let weekStart = $derived(startOfWeek(date, { weekStartsOn: 1 }));
	let weekEnd = $derived(endOfWeek(date, { weekStartsOn: 1 }));
	let weekDates = $derived(Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)));

	let orders: Record<string, TemplateOrder[]> = $state({});

	$effect(() => {
		listOrders(weekStart, weekEnd).then((listed) => (orders = listed));
	});
</script>

<div class="grid grid-cols-5 gap-4">
	{#each weekDates as date}
		<div class="flex flex-col space-y-4">
			<DayHeader {date} />
			<TodaysMenu {date} />
			{#if isPast(date) && !isToday(date) && [...ordersByDay(orders, date)].length === 0}
				<Card>
					<div class="text-xs text-gray-400 text-center">No orders for this day</div>
				</Card>
			{/if}
			{#each ordersByDay(orders, date) as order (order.kitchenId)}
				<OrderCard
					{order}
					isEditing={order.tempOrder}
					onOrderChange={(newOrderState) => handleOrderChange(orders, newOrderState)}
					onOrderCancel={(date, kitchenId) => handleCancel(orders, date, kitchenId)}
				/>
			{/each}
			<AddLocationCard
				{date}
				newOrder={(newOrder) => updateOrderForKitchen(orders, { ...newOrder, tempOrder: true })}
				locationsWithOrders={[...ordersByDay(orders, date)].map((o) => o.kitchenId)}
			/>
		</div>
	{/each}
</div>
