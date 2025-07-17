<script lang="ts">
	import Label from '../atoms/Label.svelte';
	import Input from '../atoms/Input.svelte';

	type AutoCompleteAttribute = 'on' | 'off';

	let {
		id,
		label,
		type = 'text',
		name = id,
		placeholder = '',
		value = $bindable(''),
		required = false,
		disabled = false,
		autocomplete = 'off' as AutoCompleteAttribute,
		className = '',
		transform,
		validate,
		onInput = (value: string) => {},
		onBlur = () => {},
		onFocus = () => {}
	} = $props();

	function getValue() {
		return value;
	}

	function setValue(newValue: string) {
		value = newValue;
		if (onInput) onInput(newValue);
	}
</script>

<div class="mb-4 {className}">
	<Label forId={id}>
		{#snippet children()}
			{label}
		{/snippet}
	</Label>

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
		bind:value={getValue, setValue}
		{onBlur}
		{onFocus}
		{onInput}
	/>
</div>
