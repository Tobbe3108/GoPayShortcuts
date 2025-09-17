<script lang="ts">
	export let padding: string = 'p-6';
	export let className: string = '';
	export let muted: boolean = false;
</script>

TODO: Convert to runes mode

<div
	class="rounded-lg shadow-lg border {muted
		? 'opacity-70 bg-slate-50 border-slate-200'
		: 'bg-white border-slate-200'} {padding} {className}"
	aria-disabled={muted}
>
	<slot />
</div>
