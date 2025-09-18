<script lang="ts">
	interface Props {
		value?: number;
		min?: number;
		max?: number;
		disabled?: boolean;
		onChange?: (value: number) => void;
	}

	let { value = 0, min = 0, max = 99, disabled = false, onChange = undefined }: Props = $props();

	function increment() {
		if (disabled || value >= max) return;
		const newValue = value + 1;
		onChange?.(newValue);
	}

	function decrement() {
		if (disabled || value <= min) return;
		const newValue = value - 1;
		onChange?.(newValue);
	}
</script>

<div class="flex items-center space-x-2">
	<div class="flex items-center">
		<button
			class="px-2 py-1 font-bold text-slate-700 bg-slate-200 rounded-l hover:bg-slate-300 disabled:opacity-50 focus:outline-none"
			aria-label="Decrement"
			onclick={decrement}
			disabled={disabled || value <= min}
			type="button"
		>
			-
		</button>
		<span class="w-8 text-center text-slate-700 select-none" aria-live="polite">{value}</span>
		<button
			class="px-2 py-1 font-bold text-slate-700 bg-slate-200 rounded-r hover:bg-slate-300 disabled:opacity-50 focus:outline-none"
			aria-label="Increment"
			onclick={increment}
			disabled={disabled || value >= max}
			type="button"
		>
			+
		</button>
	</div>
</div>
