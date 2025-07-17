<script lang="ts">
	type AutoCompleteAttribute = 'on' | 'off';

	let {
		type = 'text',
		id,
		name = id,
		placeholder = '',
		value = $bindable(''),
		required = false,
		disabled = false,
		autocomplete = 'off' as AutoCompleteAttribute,
		className = '',
		transform,
		validate,
		onInput,
		onBlur,
		onFocus
	} = $props();

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
	onblur={handleBlur}
	onfocus={handleFocus}
/>
