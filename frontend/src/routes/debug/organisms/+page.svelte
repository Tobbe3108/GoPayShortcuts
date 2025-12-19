<script lang="ts">
	import { notifications } from '$lib/core/notifications/notificationStore';
	import Button from '$lib/components/atoms/Button.svelte';
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import type { SimplifiedOrder } from '$lib/features/orders/models/SimplifiedOrder';

	let mockOrder: SimplifiedOrder | undefined = $state({
		date: '2025-09-22',
		kitchenId: 1,
		orderlines: [{ productId: 1, quantity: 2, price: 80 }],
		cancelEnabled: true
	});

	function addNotifications() {
		notifications.success('This is a test notification');
		notifications.warning('This is a test notification');
		notifications.error('This is a test notification');
		notifications.info('This is a test notification');
	}

	function addNotificationsWithAction() {
		notifications.success(undefined, undefined, 'Undo', () => {});
		notifications.warning(undefined, undefined, 'Undo', () => {});
		notifications.error(undefined, undefined, 'Undo', () => {});
		notifications.info(undefined, undefined, 'Undo', () => {});
	}
</script>

<div class="p-6 space-y-6">
	<div class="mb-6 flex gap-4">
		<a href="/debug/atoms" class="text-blue-600 hover:underline">Atoms Debug</a>
		<a href="/debug/molecules" class="text-blue-600 hover:underline">Molecules Debug</a>
		<a href="/debug/organisms" class="text-blue-900 font-bold underline">Organisms Debug</a>
		<a href="/debug/templates" class="text-blue-600 hover:underline">Templates Debug</a>
		<a href="/debug" class="text-blue-600 hover:underline">Main Debug</a>
	</div>

	<Label size="xxl">Organisms Debug Page</Label>

	<Label size="xl">Notifications Demo</Label>
	<section>
		<Button onclick={addNotifications}>Add Notification</Button>
		<Button onclick={addNotificationsWithAction}>Add With Action</Button>
	</section>

	<Label size="xl">OrderCard Demo</Label>
	<section>
		<div class="max-w-md">
			{#if mockOrder}
				<OrderCard order={mockOrder} onOrderChange={(orders) => (mockOrder = orders[0])} />
			{:else}
				<div class="text-gray-500">Order deleted.</div>
			{/if}
		</div>
	</section>
</div>
