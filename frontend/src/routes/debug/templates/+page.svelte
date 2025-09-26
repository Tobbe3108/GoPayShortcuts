<script lang="ts">
	import Label from '$lib/components/atoms/Label.svelte';
	import WeekGridTemplate from '$lib/components/templates/WeekGridTemplate.svelte';
</script>

<div class="p-6 space-y-6">
	<div class="mb-6 flex gap-4">
		<a href="/debug/atoms" class="text-blue-600 hover:underline">Atoms Debug</a>
		<a href="/debug/molecules" class="text-blue-600 hover:underline">Molecules Debug</a>
		<a href="/debug/organisms" class="text-blue-600 hover:underline">Organisms Debug</a>
		<a href="/debug/templates" class="text-blue-900 font-bold underline">Templates Debug</a>
		<a href="/debug" class="text-blue-600 hover:underline">Main Debug</a>
	</div>

	<Label size="xl">WeekGridTemplate Demo</Label>
	<section>
		<WeekGridTemplate date={new Date()} />
	</section>
</div>
