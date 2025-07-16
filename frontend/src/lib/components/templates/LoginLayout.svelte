<script lang="ts">
	import { base } from '$app/paths';
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
		<div class="flex justify-center mb-6">
			<img src="{base}/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-75 w-auto" />
		</div>

		<slot />
	</div>
</div>
