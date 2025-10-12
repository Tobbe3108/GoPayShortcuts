<script lang="ts">
	import { fly } from 'svelte/transition';
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import type { Notification } from '../notificationStore';

	let {
		notification,
		onClose
	}: {
		notification: Notification;
		onClose: (id: string) => void;
	} = $props();
</script>

<div
	class="p-3 rounded-lg shadow-lg flex items-center justify-between"
	class:bg-green-100={notification.type === 'success'}
	class:bg-red-100={notification.type === 'error'}
	class:bg-yellow-100={notification.type === 'warning'}
	class:bg-blue-100={notification.type === 'info'}
	class:text-green-800={notification.type === 'success'}
	class:text-red-800={notification.type === 'error'}
	class:text-yellow-800={notification.type === 'warning'}
	class:text-blue-800={notification.type === 'info'}
	transition:fly={{ y: 20, duration: 300 }}
>
	<div class="flex items-center gap-3">
		<Label size="sm">{notification.message}</Label>
		{#if notification.action}
			<Button
				variant="secondary"
				className="ml-2"
				size="sm"
				ariaLabel={notification.actionLabel ?? 'Action'}
				onclick={() => {
					notification.action?.(notification.id);
					onClose(notification.id);
				}}
			>
				{notification.actionLabel ?? 'Action'}
			</Button>
		{/if}

		<Button
			variant="transparent"
			className="ml-4 p-1 text-current opacity-70 hover:opacity-100"
			ariaLabel="Close notification"
			onclick={() => onClose(notification.id)}
		>
			<Icon name="close" size={18} ariaLabel="close" />
		</Button>
	</div>
</div>
