<script lang="ts">
	import type { Order } from '$lib/features/orders/models/order';
	import FormField from '$lib/components/molecules/FormField.svelte';
	import OrderEditor from '$lib/features/orders/molecules/OrderEditor.svelte';
	import EditModeControls from '$lib/features/orders/molecules/EditModeControls.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import DayHeader from '$lib/components/molecules/DayHeader.svelte';
	import TodaysMenu from '$lib/features/menu/molecules/TodaysMenu.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import WeekNavigator from '$lib/components/molecules/WeekNavigator.svelte';
	import { getIsoDate } from '$lib/core/utils/dateUtils';

	let inputValue = $state('');

	let order: Order = $state({
		date: new Date().toISOString(),
		kitchenId: 123,
		orderlines: [{ productId: 1, quantity: 2, price: 50 }],
		cancelEnabled: true,
		id: 123,
		kitchenName: 'Test Kitchen',
		status: 'pending',
		totalPrice: 200
	});

	let newOrder: Order | undefined = $state(undefined);

	let lastAction = $state('');

	let weekStart = $state<Date>();
	let weekEnd = $state<Date>();
</script>

<div class="p-6 space-y-6">
	<div class="mb-4 flex gap-4">
		<a href="/debug/atoms" class="text-blue-600 hover:underline">Atoms Debug</a>
		<a href="/debug/molecules" class="text-blue-900 font-bold underline">Molecules Debug</a>
		<a href="/debug/organisms" class="text-blue-600 hover:underline">Organisms Debug</a>
		<a href="/debug/templates" class="text-blue-600 hover:underline">Templates Debug</a>
		<a href="/debug" class="text-blue-600 hover:underline">Main Debug</a>
	</div>

	<Label size="xxl">Molecules Debug Page</Label>

	<Label size="xl">FormField Demo</Label>
	<section>
		<FormField
			label="FormField Test"
			placeholder="Type here..."
			onInput={(e: string) => (inputValue = e)}
		/>
		<Label variant="muted">Input: {inputValue}</Label>
	</section>

	<Label size="xl">OrderEditor Demo</Label>
	<section>
		<div class="flex space-x-4">
			<OrderEditor {order} onOrderChange={(updatedOrder) => (order = updatedOrder)} />
			<OrderEditor
				{order}
				editMode={true}
				onOrderChange={(updatedOrder) => (order = updatedOrder)}
			/>
		</div>
	</section>

	<Label size="xl">EditModeControls Demo</Label>
	<section>
		<EditModeControls
			direction="row"
			onSave={() => (lastAction = 'Save')}
			onCancel={() => (lastAction = 'Cancel')}
			onDelete={() => (lastAction = 'Delete')}
		/>
		<EditModeControls
			direction="column"
			onSave={() => (lastAction = 'Save')}
			onCancel={() => (lastAction = 'Cancel')}
			onDelete={() => (lastAction = 'Delete')}
		/>
		<EditModeControls direction="row" locked={true} />
		<Label variant="muted">Last action: {lastAction}</Label>
	</section>

	<Label size="xl">DayHeader Demo</Label>
	<section>
		<DayHeader date={new Date()} />
	</section>

	<Label size="xl">TodaysMenu Demo</Label>
	<section>
		<TodaysMenu date={new Date()} />
	</section>

	<Label size="xl">AddLocationCard Demo</Label>
	<section class="justify-center">
		<AddLocationCard
			newOrder={(order) => (newOrder = order)}
			locationsWithOrders={newOrder ? [newOrder.kitchenId] : []}
		/>
		<Label variant="muted">Latest order location: {newOrder?.kitchenName}</Label>
	</section>

	<Label size="xl">WeekNavigator Demo</Label>
	<section class="max-w-max justify-center">
		<WeekNavigator
			date={new Date()}
			onWeekChange={(newStart, newEnd) => ((weekStart = newStart), (weekEnd = newEnd))}
		/>
		<Label variant="muted"
			>Selected week: {weekStart ? getIsoDate(weekStart) : ''} - {weekEnd
				? getIsoDate(weekEnd)
				: ''}</Label
		>
	</section>
</div>
