<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Card from '$lib/components/atoms/Card.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import Input from '$lib/components/atoms/Input.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
</script>

<div class="p-8 space-y-8">
	<div class="mb-4 flex gap-4">
		<a href="/debug/atoms" class="text-blue-900 font-bold underline">Atoms Debug</a>
		<a href="/debug/molecules" class="text-blue-600 hover:underline">Molecules Debug</a>
		<a href="/debug" class="text-blue-600 hover:underline">Main Debug</a>
	</div>
	<h1 class="text-2xl font-bold mb-4">Atoms Debug Page</h1>
	<div class="space-y-8">
		<!--  Input -->
		<div class="space-y-2">
			<Input id="debug-input" placeholder="Input Atom" />
			<Input id="debug-input-err" placeholder="Input with error" error="This is an error" />
			<Input
				id="debug-input-num"
				type="number"
				min={0}
				max={10}
				step={1}
				placeholder="Numeric Input"
			/>
			<Input id="debug-input-dis" placeholder="Disabled Input" disabled={true} />
		</div>

		<!-- Button Variants -->
		<div class="flex flex-wrap gap-4 items-center">
			<Button>Default Button</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="danger">Danger</Button>
			<Button disabled={true}>Disabled</Button>
			<Button fullWidth={true}>Full Width</Button>
		</div>

		<!-- Card Variants -->
		<div class="flex flex-wrap gap-4">
			<Card><div class="p-4">Card Atom (normal)</div></Card>
			<Card muted={true}><div class="p-4">Card Atom (muted)</div></Card>
		</div>

		<!-- Label Variants -->
		<div class="space-y-2">
			<Label forId="label-default">Default Label</Label>
			<Label forId="label-success" variant="success">Success Label</Label>
			<Label forId="label-error" variant="error">Error Label</Label>
			<Label forId="label-muted" variant="muted">Muted Label</Label>
		</div>

		<!-- Icon Variants -->
		<div class="flex flex-wrap gap-4 items-center">
			<Icon name="edit" ariaLabel="Edit" />
			<Icon name="delete" ariaLabel="Delete" className="text-danger" />
			<Icon name="lock" ariaLabel="Lock" className="text-muted-dark" />
			<Icon name="plus" ariaLabel="Plus" />
			<Icon name="minus" ariaLabel="Minus" />
			<Icon name="check" ariaLabel="Check" className="text-success" />
			<Icon name="close" ariaLabel="Close" />
		</div>
	</div>
</div>
