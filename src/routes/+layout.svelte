<script lang="ts">
	import '../app.css';
	import authStore from '$lib/stores/authStore';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { onMount } from 'svelte';
	import { checkAuth, loadAuth } from '$lib/services/authService';

	onMount(async () => {
		loadAuth();
		await checkAuth();
	});
</script>

<div class="min-h-screen bg-gray-50">
	{#if $authStore.loading}
		<div class="min-h-screen flex items-center justify-center">
			<div class="text-center">
				<LoadingSpinner size="w-12 h-12" />
				<p class="mt-4 text-gray-600">Validating session...</p>
			</div>
		</div>
	{:else}
		<slot />
	{/if}
</div>
