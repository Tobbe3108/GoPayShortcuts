<script>
  import Card from './Card.svelte';
  export let muted = false;
  export let className = '';
</script>

<Card {muted} class={className}>
  <div>Inner</div>
</Card>
