<script lang="ts">
	import DayHeader from '$lib/components/molecules/DayHeader.svelte';
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import WeekNavigator from '$lib/components/molecules/WeekNavigator.svelte';
	import { startOfWeek, endOfWeek, getWeek, addDays, format } from 'date-fns';
	import { ordersService } from '$lib/features/orders/ordersService';
	import TodaysMenu from '$lib/features/menu/molecules/TodaysMenu.svelte';
	import type { SimplifiedOrder } from '$lib/features/orders/models/SimplifiedOrder';

	type WeekGridProps = {
		date: Date;
	};

	let { date }: WeekGridProps = $props();

	let weekStart = $state(startOfWeek(date, { weekStartsOn: 1 }));
	let weekEnd = $state(endOfWeek(date, { weekStartsOn: 1 }));
	let weekDates = $derived(Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)));

	let orders: SimplifiedOrder[] = $state([]);
	let tempOrders: SimplifiedOrder[] = $state([]);

	$effect(() => {
		(async () => {
			orders = await ordersService.listOrders(weekStart, weekEnd);
		})();
	});

	function ordersByDay(list: SimplifiedOrder[], date: Date) {
		return list.filter((o) => o.date === format(date, 'yyyy-MM-dd'));
	}

	function handleOrderChange(updatedOrder: SimplifiedOrder | undefined) {
		// TODO:
	}
</script>

<div>
	<WeekNavigator
		{date}
		onWeekChange={(newStart, newEnd) => {
			weekStart = newStart;
			weekEnd = newEnd;
		}}
	/>

	<div class="grid grid-cols-5 gap-4">
		{#each weekDates as date}
			<div class="flex flex-col space-y-4">
				<DayHeader {date} />
				<TodaysMenu {date} />
				{#each ordersByDay(orders, date) as order}
					<OrderCard {order} onOrderChange={handleOrderChange} />
				{/each}
				{#each ordersByDay(tempOrders, date) as tempOrder}
					<OrderCard order={tempOrder} isEditing={true} onOrderChange={handleOrderChange} />
				{/each}
				<AddLocationCard
					{date}
					newOrder={(newOrder) => {
						tempOrders = [...tempOrders, newOrder];
					}}
					locationsWithOrders={ordersByDay([...tempOrders, ...orders], date).map(
						(o) => o.kitchenId
					)}
				/>
			</div>
		{/each}
	</div>
</div>
