<script lang="ts">
	import { notifications } from '../notificationStore';
	import NotificationItem from '../molecules/NotificationItem.svelte';

	import type { Notification } from '../notificationStore';
	let notificationsState: Notification[] = $state([]);

	$effect(() => {
		const unsubscribe = notifications.subscribe((value) => {
			notificationsState = value;
		});
		return unsubscribe;
	});
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
	{#each notificationsState as notification (notification.id)}
		<NotificationItem {notification} onClose={notifications.remove} />
	{/each}
</div>
