<script lang="ts">
  import { notifications } from '$lib/stores/notificationStore';
  import { fly } from 'svelte/transition';
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
  {#each $notifications as notification (notification.id)}
    <div 
      class="p-3 rounded-lg shadow-lg flex items-center justify-between"
      class:bg-green-100={notification.type === 'success'}
      class:bg-red-100={notification.type === 'error'}
      class:bg-yellow-100={notification.type === 'warning'}
      class:bg-blue-100={notification.type === 'info'}
      class:text-green-800={notification.type === 'success'}
      class:text-red-800={notification.type === 'error'}
      class:text-yellow-800={notification.type === 'warning'}
      class:text-blue-800={notification.type === 'info'}
      transition:fly={{ y: 20, duration: 300 }}
    >
      <span>{notification.message}</span>
      <button 
        class="ml-4 text-current opacity-70 hover:opacity-100"
        on:click={() => notifications.remove(notification.id)}
      >
        ✕
      </button>
    </div>
  {/each}
</div>
