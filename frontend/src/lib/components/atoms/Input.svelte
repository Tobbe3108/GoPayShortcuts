<script lang="ts">
	import Label from './Label.svelte';

	export let type: string = 'text';
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let placeholder: string = '';
	export let value: string | number = '';
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let autocomplete: 'on' | 'off' = 'off';
	export let className: string = '';
	export let transform: ((v: string) => string) | undefined = undefined;
	export let validate: ((v: string) => boolean) | undefined = undefined;
	export let onInput: ((v: string) => void) | undefined = undefined;
	export let onBlur: (() => void) | undefined = undefined;
	export let onFocus: (() => void) | undefined = undefined;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step: number | undefined = undefined;
	export let ariaLabel: string = '';
	export let error: string = '';

	let internalValue = value?.toString() ?? '';
	$: if (type !== 'number' && value?.toString() !== internalValue)
		internalValue = value?.toString() ?? '';

	// For type='number', bind directly to value, else use internalValue
	let bindTarget: any;
	$: bindTarget = type === 'number' ? value : internalValue;

	const inputClasses = [
		'w-full p-3 border rounded-md',
		error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-slate-600',
		'focus:outline-none focus:ring-2',
		'disabled:opacity-50 disabled:cursor-not-allowed',
		'transition duration-150 ease-in-out',
		className
	].join(' ');

	function handleInput(e: Event) {
		let newValue = (e.target as HTMLInputElement).value;
		if (transform) newValue = transform(newValue);
		if (!validate || validate(newValue)) {
			internalValue = newValue;
			value = type === 'number' ? Number(newValue) : newValue;
			if (onInput) onInput(newValue);
		} else {
			internalValue = newValue;
		}
	}
</script>

<input
	{type}
	{id}
	{name}
	{placeholder}
	{required}
	{disabled}
	{autocomplete}
	{min}
	{max}
	{step}
	aria-label={ariaLabel}
	aria-invalid={!!error}
	class={inputClasses}
	bind:value={bindTarget}
	on:input={handleInput}
	on:blur={onBlur}
	on:focus={onFocus}
/>

{#if error}
	<Label forId={id} variant="error">{error}</Label>
{/if}
