<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/authStore';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let { children } = $props();
	let isLoading = true;

	import { effect } from 'svelte';

	// Initialize auth on client-side
	onMount(() => {
		if (browser) {
			authStore.initialize();
		}
	});
	
	// Subscribe to auth store to track loading state
	let unsubscribe = null;
	onMount(() => {
		if (browser) {
			unsubscribe = authStore.subscribe((state) => {
				isLoading = state.loading;
			});
			return () => {
				if (unsubscribe) unsubscribe();
			};
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	{#if isLoading}
		<div class="min-h-screen flex items-center justify-center">
			<div class="text-center">
				<LoadingSpinner size="w-12 h-12" />
				<p class="mt-4 text-gray-600">Validating session...</p>
			</div>
		</div>
	{:else}
		{@render children()}
	{/if}
</div>
