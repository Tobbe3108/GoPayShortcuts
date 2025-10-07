<script lang="ts">
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import TodaysMenu from '$lib/features/menu/molecules/TodaysMenu.svelte';
	import { endOfWeek, startOfWeek } from 'date-fns';
	import type { SimplifiedOrder } from '$lib/features/orders/models/SimplifiedOrder';
	import {
		listOrders,
		ordersByDay,
		handleOrderChange,
		handleTempChange,
		handleCancel,
		updateOrderForKitchen
	} from '$lib/features/orders/orderUtils';
	import DayNavigator from '$lib/components/organisms/DayNavigator.svelte';

	type DayViewProps = {
		date: Date;
	};

	let { date }: DayViewProps = $props();

	let selectedDate = $state(date);
	let weekStart = $derived(startOfWeek(selectedDate, { weekStartsOn: 1 }));
	let weekEnd = $derived(endOfWeek(selectedDate, { weekStartsOn: 1 }));

	let orders: Record<string, SimplifiedOrder[]> = $state({});
	let tempOrders: Record<string, SimplifiedOrder[]> = $state({});

	$effect(() => {
		listOrders(weekStart, weekEnd).then((listed) => (orders = listed));
	});
</script>

<div class="flex flex-col space-y-4 w-full">
	<DayNavigator
		date={selectedDate}
		onDayChange={(newDate) => {
			selectedDate = newDate;
		}}
	/>
	<TodaysMenu date={selectedDate} />
	{#each ordersByDay(orders, selectedDate) as order (order.kitchenId)}
		<OrderCard
			{order}
			isEditing={false}
			onOrderChange={(newOrderState) => handleOrderChange(orders, newOrderState)}
			onOrderCancel={(selectedDate, kitchenId) => handleCancel(orders, selectedDate, kitchenId)}
		/>
	{/each}
	{#each ordersByDay(tempOrders, selectedDate) as order (order.kitchenId)}
		<OrderCard
			{order}
			isEditing={true}
			onOrderChange={(newOrderState) => handleTempChange(orders, tempOrders, newOrderState)}
			onOrderCancel={(selectedDate, kitchenId) => handleCancel(tempOrders, selectedDate, kitchenId)}
		/>
	{/each}
	<AddLocationCard
		date={selectedDate}
		newOrder={(newOrder) => updateOrderForKitchen(tempOrders, newOrder)}
		locationsWithOrders={[
			...ordersByDay(orders, selectedDate),
			...ordersByDay(tempOrders, selectedDate)
		].map((o) => o.kitchenId)}
	/>
</div>
