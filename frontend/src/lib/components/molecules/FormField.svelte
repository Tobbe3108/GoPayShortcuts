<script lang="ts">
	import Label from '../atoms/Label.svelte';
	import Input from '../atoms/Input.svelte';
	import type { InputEvent } from '$lib/types/api';

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
	
	// Callback props instead of event dispatching
	export let onInput: ((value: any) => void) | undefined = undefined;
	export let onBlur: (() => void) | undefined = undefined;
	export let onFocus: (() => void) | undefined = undefined;

	function handleInput(event: InputEvent): void {
		if (onInput) onInput(event.detail);
	}

	function handleBlur(): void {
		if (onBlur) onBlur();
	}

	function handleFocus(): void {
		if (onFocus) onFocus();
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
		{value}
		on:input={handleInput}
		on:blur={handleBlur}
		on:focus={handleFocus}
	/>
</div>
