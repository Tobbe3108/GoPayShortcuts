<!-- TODO: Use Atoms -->

<script lang="ts">
	import Label from '../atoms/Label.svelte';
	import Input from '../atoms/Input.svelte';

	type AutoCompleteAttribute = 'on' | 'off';

	let {
		id = undefined as string | undefined,
		label = undefined as string | undefined,
		type = 'text' as string,
		name = id as string | undefined,
		placeholder = '' as string,
		value = $bindable(''),
		required = false as boolean,
		disabled = false as boolean,
		autocomplete = 'off' as AutoCompleteAttribute,
		className = '' as string,
		transform = ((v: string) => v) as (v: string) => string,
		validate = ((v: string) => true) as (v: string) => boolean,
		onInput = ((v: string) => v) as (v: string) => string,
		onBlur = (() => {}) as () => void,
		onFocus = (() => {}) as () => void
	} = $props();
</script>

<div class={className}>
	<Label forId={id}>{label}</Label>
	<Input
		{id}
		{name}
		{type}
		{placeholder}
		{required}
		{disabled}
		{autocomplete}
		{transform}
		{validate}
		bind:value
		{onInput}
		{onBlur}
		{onFocus}
	/>
</div>
