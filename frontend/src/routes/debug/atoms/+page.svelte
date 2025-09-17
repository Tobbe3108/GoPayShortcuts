<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Card from '$lib/components/atoms/Card.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import Input from '$lib/components/atoms/Input.svelte';
</script>

<div class="p-8 space-y-8">
	<h1 class="text-2xl font-bold mb-4">Atoms Debug Page</h1>
	<div class="space-y-8">
		<!-- Label + Input -->
		<div>
			<Label forId="debug-input">Label Atom</Label>
			<Input id="debug-input" placeholder="Input Atom" />
		</div>

		<!-- Button Variants -->
		<div class="flex gap-4 items-center">
			<Button>Default Button</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="danger">Danger</Button>
			<Button disabled={true}>Disabled</Button>
		</div>

		<!-- Card Variants -->
		<div class="flex gap-4">
			<Card><div class="p-4">Card Atom (normal)</div></Card>
		</div>
	</div>
</div>
