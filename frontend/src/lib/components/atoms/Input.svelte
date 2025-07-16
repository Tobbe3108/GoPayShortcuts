<script lang="ts">
	export let type = 'text';
	export let id: string;
	export let name = id;
	export let placeholder = '';
	export let value = '';
	export let required = false;
	export let disabled = false;
	export let autocomplete: 'on' | 'off' = 'off';
	export let className = '';

	// Callback props instead of event dispatching
	export let onInput: ((value: string) => void) | undefined = undefined;
	export let onBlur: (() => void) | undefined = undefined;
	export let onFocus: (() => void) | undefined = undefined;

	// Base styling with ability to extend via props
	const inputClasses = [
		'w-full p-3 border border-gray-300 rounded-md',
		'focus:outline-none focus:ring-2 focus:ring-slate-600',
		'disabled:opacity-50 disabled:cursor-not-allowed',
		'transition duration-150 ease-in-out',
		className
	].join(' ');

	function handleInput(e: Event): void {
		const target = e.target as HTMLInputElement;
		if (onInput) onInput(target.value);
	}

	function handleBlur(): void {
		if (onBlur) onBlur();
	}

	function handleFocus(): void {
		if (onFocus) onFocus();
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
	class={inputClasses}
	bind:value
	on:input={handleInput}
	on:blur={handleBlur}
	on:focus={handleFocus}
/>
