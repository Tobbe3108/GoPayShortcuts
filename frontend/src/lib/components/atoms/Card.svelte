<script lang="ts">
	type CardProps = {
		padding?: string;
		className?: string;
		muted?: boolean;
		children?: any;
	};

	let {
		padding = 'p-6',
		className = '',
		muted = false,
		children = $bindable(undefined)
	}: CardProps = $props();

	let cardClass = $derived(
		[
			'rounded-lg shadow-lg border',
			muted ? 'opacity-70 bg-slate-50 border-slate-200' : 'bg-white border-slate-200',
			padding,
			className
		].join(' ')
	);
</script>

<div class={cardClass} aria-disabled={muted}>
	{@render children?.()}
</div>
