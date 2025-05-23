<script lang="ts">
	import '../app.css';
	import { auth } from '$lib/services/authService';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
</script>

<div class="min-h-screen bg-gray-50">
	{#if $auth.loading}
		<div class="min-h-screen flex items-center justify-center">
			<div class="text-center">
				<LoadingSpinner size="w-12 h-12" />
				<p class="mt-4 text-gray-600">Validating session...</p>
			</div>
		</div>
	{:else}
		<slot></slot>
	{/if}
</div>
