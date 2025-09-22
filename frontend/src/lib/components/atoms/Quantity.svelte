<script lang="ts">
	import Button from './Button.svelte';
	import Label from './Label.svelte';
	import Icon from './Icon.svelte';

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

	const iconSize = 15;
</script>

<div class="flex justify-between items-center space-x-2">
	<div class="flex flex-row items-center gap-x-2">
		<Button
			variant="transparent"
			ariaLabel="Decrement"
			onclick={decrement}
			size=""
			disabled={disabled || value <= min}
			className="flex items-center justify-center"
		>
			<Icon name="minus" size={iconSize} ariaLabel="Decrement" />
		</Button>
		<Label className="text-primary text-center select-none flex items-center justify-center"
			>{value}</Label
		>
		<Button
			variant="transparent"
			ariaLabel="Increment"
			onclick={increment}
			size=""
			disabled={disabled || value >= max}
			className="flex items-center justify-center"
		>
			<Icon name="plus" size={iconSize} ariaLabel="Increment" />
		</Button>
	</div>
</div>
