<script lang="ts">
	import {
		Pencil,
		Trash2,
		Lock,
		Plus,
		Minus,
		Check,
		X,
		ChevronUp,
		ChevronDown,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte';

	type IconName =
		| 'edit'
		| 'delete'
		| 'lock'
		| 'plus'
		| 'minus'
		| 'check'
		| 'close'
		| 'open'
		| 'collapse'
		| 'left'
		| 'right';
	type IconProps = {
		role?: string;
		ariaLabel?: string;
		className?: string;
		size?: number;
		name: IconName;
	};

	let { role = 'img', ariaLabel = '', className = '', size = 20, name }: IconProps = $props();
</script>

<span
	{role}
	aria-label={ariaLabel}
	class={`inline-block align-middle ${className}`}
	style={`width:${size}px;height:${size}px;`}
>
	{#if name === 'edit'}<Pencil {size} aria-label={ariaLabel} />
	{:else if name === 'delete'}<Trash2 {size} aria-label={ariaLabel} />
	{:else if name === 'lock'}<Lock {size} aria-label={ariaLabel} />
	{:else if name === 'plus'}<Plus {size} aria-label={ariaLabel} />
	{:else if name === 'minus'}<Minus {size} aria-label={ariaLabel} />
	{:else if name === 'check'}<Check {size} aria-label={ariaLabel} />
	{:else if name === 'close'}<X {size} aria-label={ariaLabel} />
	{:else if name === 'open'}<ChevronDown {size} aria-label={ariaLabel} />
	{:else if name === 'collapse'}<ChevronUp {size} aria-label={ariaLabel} />
	{:else if name === 'left'}<ChevronLeft {size} aria-label={ariaLabel} />
	{:else if name === 'right'}<ChevronRight {size} aria-label={ariaLabel} />
	{/if}
</span>
