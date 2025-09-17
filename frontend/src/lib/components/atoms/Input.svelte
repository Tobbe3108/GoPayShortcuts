<script lang="ts">
	import Label from './Label.svelte';

	type InputProps = {
		type?: string;
		id?: string;
		name?: string;
		placeholder?: string;
		value?: string | number;
		required?: boolean;
		disabled?: boolean;
		autocomplete?: 'on' | 'off';
		className?: string;
		transform?: (v: string) => string;
		validate?: (v: string) => boolean;
		onInput?: (v: string) => void;
		onBlur?: () => void;
		onFocus?: () => void;
		min?: number;
		max?: number;
		step?: number;
		ariaLabel?: string;
		error?: string;
	};

	let {
		type = 'text',
		id = undefined,
		name = undefined,
		placeholder = '',
		value = $bindable(''),
		required = false,
		disabled = false,
		autocomplete = 'off',
		className = '',
		transform = undefined,
		validate = undefined,
		onInput = undefined,
		onBlur = undefined,
		onFocus = undefined,
		min = undefined,
		max = undefined,
		step = undefined,
		ariaLabel = '',
		error = ''
	}: InputProps = $props();

	let internalValue = $state(value?.toString() ?? '');

	$effect(() => {
		if (type !== 'number' && value?.toString() !== internalValue) {
			internalValue = value?.toString() ?? '';
		}
	});

	let bindTarget = $derived(type === 'number' ? value : internalValue);

	const inputClasses = $derived(
		[
			'w-full p-3 border rounded-md',
			error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-slate-600',
			'focus:outline-none focus:ring-2',
			'disabled:opacity-50 disabled:cursor-not-allowed',
			'transition duration-150 ease-in-out',
			className
		].join(' ')
	);

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
	oninput={handleInput}
	onblur={onBlur}
	onfocus={onFocus}
/>

{#if error}
	<Label forId={id} variant="error">{error}</Label>
{/if}
