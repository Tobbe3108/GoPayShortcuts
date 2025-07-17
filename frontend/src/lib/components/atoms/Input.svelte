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

	export let transform: ((value: string) => string) | undefined = undefined;
	export let validate: ((value: string) => boolean) | undefined = undefined;

	export let onInput: ((value: string) => void) | undefined = undefined;
	export let onBlur: (() => void) | undefined = undefined;
	export let onFocus: (() => void) | undefined = undefined;

	const inputClasses = [
		'w-full p-3 border border-gray-300 rounded-md',
		'focus:outline-none focus:ring-2 focus:ring-slate-600',
		'disabled:opacity-50 disabled:cursor-not-allowed',
		'transition duration-150 ease-in-out',
		className
	].join(' ');

	function handleBlur(): void {
		if (onBlur) onBlur();
	}

	function handleFocus(): void {
		if (onFocus) onFocus();
	}

	function getValue() {
		return value;
	}

	function setValue(newValue: string) {
		if (transform) {
			newValue = transform(newValue);
		}

		if (validate && !validate(newValue)) {
			// Could trigger validation UI here if needed
		}

		value = newValue;
		if (onInput) onInput(newValue);
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
	bind:value={getValue, setValue}
	on:blur={handleBlur}
	on:focus={handleFocus}
/>
