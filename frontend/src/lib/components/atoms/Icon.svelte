<script lang="ts">
	import { Pencil, Trash2, Lock, Plus, Minus, Check, X } from 'lucide-svelte';

	type IconName = 'edit' | 'delete' | 'lock' | 'plus' | 'minus' | 'check' | 'close';

	export let role: string = 'img';
	export let ariaLabel: string = '';
	export let className: string = '';
	export let size: number = 20;
	export let name: IconName;
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
	{/if}
</span>
