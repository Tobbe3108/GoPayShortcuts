<script lang="ts">
	import Label from '../atoms/Label.svelte';
	import Input from '../atoms/Input.svelte';

	export let id: string;
	export let label: string;
	export let type = 'text';
	export let name = id;
	export let placeholder = '';
	export let value = '';
	export let required = false;
	export let disabled = false;
	export let autocomplete: 'on' | 'off' = 'off';
	export let className = '';

	export let transform: ((value: string) => string) | undefined = undefined;
	export let validate: ((value: string) => boolean) | undefined = undefined;

	export let onInput: ((value: any) => void) | undefined = undefined;
	export let onBlur: (() => void) | undefined = undefined;
	export let onFocus: (() => void) | undefined = undefined;

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
		{label}
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
	/>
</div>
