<script lang="ts">
	const { size = 'w-8 h-8' } = $props<{
		size?: string;
	}>();
</script>

TODO: fix errors / refactor / Add page and test

<div class="flex justify-center items-center">
	<div
		class={`${size} animate-spin rounded-full border-4 border-gray-200 border-t-slate-800`}
	></div>
</div>
