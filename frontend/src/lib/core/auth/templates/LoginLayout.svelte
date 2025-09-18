<script lang="ts">
	import { base } from '$app/paths';

	type LoginLayoutProps = {
		children?: any;
	};

	let { children }: LoginLayoutProps = $props();
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
		<div class="flex justify-center mb-6">
			<img src="{base}/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-28 w-auto" />
		</div>
		{@render children?.()}
	</div>
</div>
