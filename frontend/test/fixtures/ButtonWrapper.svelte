<script>
  import Button from '../../src/lib/components/atoms/Button.svelte';
  let { text = '', onclick = undefined, disabled = false } = $props();
</script>

<Button {onclick} {disabled}>{text}</Button>
