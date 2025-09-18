<script lang="ts">
	import '../app.css';
	import { authStore } from '../core/auth/store';
	import LoadingSpinner from '../core/loading/LoadingSpinner.svelte';
	import Notifications from '../features/notefications/Notifications.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="min-h-screen bg-slate-50">
	{#if $authStore.isLoading && page.url.pathname !== base + '/login'}
		<div class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
			<div class="text-center">
				<LoadingSpinner size="w-12 h-12" />
				<p class="mt-4 text-slate-600">Validating session...</p>
			</div>
		</div>
	{:else}
		{@render children?.()}
	{/if}

	<Notifications />
</div>
