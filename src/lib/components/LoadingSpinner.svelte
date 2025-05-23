<script lang="ts">
    const { size = "w-8 h-8" } = $props<{
        size?: string;
    }>();
    // No local state to convert to $state() in this component
</script>

<div class="flex justify-center items-center">
    <div class={`${size} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}></div>
</div>
