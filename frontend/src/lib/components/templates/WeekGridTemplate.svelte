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

	let orders: Record<string, SimplifiedOrder[]> = $state({});
	let tempOrders: Record<string, SimplifiedOrder[]> = $state({});

	$effect(() => {
		(async () => {
			orders = await ordersService.listOrders(weekStart, weekEnd).then((res) =>
				res.reduce(
					(record, order) => {
						if (!record[order.date]) record[order.date] = [];
						record[order.date].push(order);
						return record;
					},
					{} as Record<string, SimplifiedOrder[]>
				)
			);
		})();
	});

	function ordersByDay(record: Record<string, SimplifiedOrder[]>, date: Date) {
		return record[format(date, 'yyyy-MM-dd')] || [];
	}

	function handleOrderChange(newOrderState: SimplifiedOrder[] | undefined): void {
		if (newOrderState) {
			for (const order of newOrderState) {
				updateOrderForKitchen(orders, order);
			}
		}
	}

	function handleTempChange(newOrderState: SimplifiedOrder[] | undefined): void {
		if (newOrderState) {
			for (const order of newOrderState) {
				tempOrders[order.date] =
					tempOrders[order.date]?.filter((o) => o.kitchenId !== order.kitchenId) || [];
				updateOrderForKitchen(orders, order);
			}
		}
	}

	function handleCancel(
		record: Record<string, SimplifiedOrder[]>,
		date: string,
		kitchenId: number
	): void {
		record[date] = record[date]?.filter((o) => o.kitchenId !== kitchenId) || [];
	}

	function updateOrderForKitchen(
		record: Record<string, SimplifiedOrder[]>,
		order: SimplifiedOrder
	): void {
		record[order.date] = record[order.date]?.filter((o) => o.kitchenId !== order.kitchenId) || [];
		record[order.date].push(order);
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
				{#each ordersByDay(orders, date) as order (order.kitchenId)}
					<OrderCard
						{order}
						isEditing={false}
						onOrderChange={handleOrderChange}
						onOrderCancel={(date, kitchenId) => handleCancel(orders, date, kitchenId)}
					/>
				{/each}
				{#each ordersByDay(tempOrders, date) as order (order.kitchenId)}
					<OrderCard
						{order}
						isEditing={true}
						onOrderChange={handleTempChange}
						onOrderCancel={(date, kitchenId) => handleCancel(tempOrders, date, kitchenId)}
					/>
				{/each}
				<AddLocationCard
					{date}
					newOrder={(newOrder) => updateOrderForKitchen(tempOrders, newOrder)}
					locationsWithOrders={[...ordersByDay(orders, date), ...ordersByDay(tempOrders, date)].map(
						(o) => o.kitchenId
					)}
				/>
			</div>
		{/each}
	</div>
</div>
