<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import Button from '../atoms/Button.svelte';

	type MainLayoutProps = {
		onLogout?: () => void;
		isAuthenticated?: boolean;
		children?: any;
	};

	let { onLogout = () => {}, isAuthenticated = false, children }: MainLayoutProps = $props();
</script>

<div class="min-h-screen">
	<div class="container p-4 mx-auto">
		<div class="container mx-auto flex items-center justify-between mb-8">
			<img src="{base}/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-28 w-auto" />
			{#if isAuthenticated && page.url.pathname !== '/login'}
				<Button variant="primary" onclick={() => onLogout()}>
					{#snippet children()}
						Log ud
					{/snippet}
				</Button>
			{/if}
		</div>
		{@render children?.()}
	</div>
</div>
