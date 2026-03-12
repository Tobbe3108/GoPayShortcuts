<script>
  import Button from '../../src/lib/components/atoms/Button.svelte';
  export let text = '';
  export let onclick = undefined;
  export let disabled = false;
</script>

<Button {onclick} {disabled}>{text}</Button>
