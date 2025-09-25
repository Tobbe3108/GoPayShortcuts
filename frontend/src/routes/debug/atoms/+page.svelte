<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Card from '$lib/components/atoms/Card.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import Input from '$lib/components/atoms/Input.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import Selector from '$lib/components/atoms/Select.svelte';
	import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';
	import Quantity from '$lib/components/atoms/Quantity.svelte';

	const locations = [
		{ id: 'canteen1', name: 'Canteen 1' },
		{ id: 'canteen2', name: 'Canteen 2' },
		{ id: 'canteen3', name: 'Canteen 3' }
	];

	let selectedLocation: string | number | undefined = undefined;

	let quantity = 1;
</script>

<div class="p-6 space-y-6">
	<div class="mb-4 flex gap-4">
		<a href="/debug/atoms" class="text-blue-900 font-bold underline">Atoms Debug</a>
		<a href="/debug/molecules" class="text-blue-600 hover:underline">Molecules Debug</a>
		<a href="/debug/organisms" class="text-blue-600 hover:underline">Organisms Debug</a>
		<a href="/debug" class="text-blue-600 hover:underline">Main Debug</a>
	</div>

	<Label size="xxl">Atoms Debug Page</Label>

	<section>
		<Label size="xl" className="mb-2">Input Demo</Label>
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
	</section>

	<section>
		<Label size="xl" className="mb-2">Button Demo</Label>
		<div class="flex flex-wrap gap-4 items-center">
			<Button>Default Button</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="danger" size="sm">Danger</Button>
			<Button disabled={true} size="lg">Disabled</Button>
			<Button fullWidth={true}>Full Width</Button>
		</div>
	</section>

	<section>
		<Label size="xl" className="mb-2">Card Demo</Label>
		<div class="flex flex-wrap gap-4">
			<Card><div class="p-4">Card Atom (normal)</div></Card>
			<Card muted={true}><div class="p-4">Card Atom (muted)</div></Card>
		</div>
	</section>

	<section>
		<Label size="xl" className="mb-2">Label Demo</Label>
		<div class="space-y-2">
			<Label forId="label-default">Default Label</Label>
			<Label forId="label-success" variant="success" size="xxl">Success Label</Label>
			<Label forId="label-error" variant="error" size="lg">Error Label</Label>
			<Label forId="label-muted" variant="muted" size="xs">Muted Label</Label>
		</div>
	</section>

	<section>
		<Label size="xl" className="mb-2">Icon Demo</Label>
		<div class="flex flex-wrap gap-4 items-center">
			<Icon name="edit" ariaLabel="Edit" />
			<Icon name="delete" ariaLabel="Delete" className="text-danger" />
			<Icon name="lock" ariaLabel="Lock" className="text-muted-dark" />
			<Icon name="plus" ariaLabel="Plus" />
			<Icon name="minus" ariaLabel="Minus" />
			<Icon name="check" ariaLabel="Check" className="text-success" />
			<Icon name="close" ariaLabel="Close" />
		</div>
	</section>

	<section>
		<Label size="xl" className="mb-2">LocationSelector Demo</Label>
		<Selector
			label="Some lable"
			options={locations}
			selectedId={selectedLocation}
			onChange={(id: string | number) => (selectedLocation = id)}
		/>
		<Label variant="muted">Location: {selectedLocation}</Label>
	</section>

	<section>
		<Label size="xl" className="mb-2">LoadingSpinner Demo</Label>
		<LoadingSpinner />
	</section>

	<section>
		<Label size="xl" className="mb-2">Quantity Demo</Label>
		<Quantity value={quantity} min={0} max={10} onChange={(v: number) => (quantity = v)} />
		<Label variant="muted">Quantity: {quantity}</Label>
	</section>
</div>
