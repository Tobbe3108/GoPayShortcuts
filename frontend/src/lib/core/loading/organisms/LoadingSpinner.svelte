<script lang="ts">
	type LoadingSpinnerProps = {
		size?: string;
	};

	const { size = 'w-8 h-8' }: LoadingSpinnerProps = $props();
</script>

<div class="flex justify-center items-center">
	<div class={`${size} animate-spin rounded-full border-4 border-gray-200 border-t-primary`}></div>
</div>
