<script lang="ts">
	import { fly } from 'svelte/transition';
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';

	let {
		notification,
		onClose
	}: {
		notification: { id: string; message: string; type: string };
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
	<span>{notification.message}</span>
	<Button
		variant="transparent"
		className="ml-4 p-1 text-current opacity-70 hover:opacity-100"
		ariaLabel="Close notification"
		onclick={() => onClose(notification.id)}
	>
		<Icon name="close" size={18} ariaLabel="close" />
	</Button>
</div>
