<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import Button from '../atoms/Button.svelte';

	export let onLogout = () => {};
	export let isAuthenticated = false;
</script>

<div class="min-h-screen bg-slate-50">
	<div class="container p-4 mx-auto">
		<div class="container mx-auto flex items-center justify-between mb-8">
			<img src="{base}/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-28 w-auto" />

			{#if isAuthenticated && $page.url.pathname !== '/login'}
				<Button variant="primary" on:click={onLogout}>Log ud</Button>
			{/if}
		</div>

		<slot />
	</div>
</div>
