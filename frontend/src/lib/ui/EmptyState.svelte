<script lang="ts">
  import Icon from '$lib/ui/Icon.svelte';

  let { icon = 'inbox', title = 'Sin datos', message = '', action = '' as string | undefined, onaction = undefined as (() => void) | undefined }: { icon?: string; title?: string; message?: string; action?: string; onaction?: () => void } = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
    <Icon name={icon} class="w-8 h-8 text-gray-400" />
  </div>
  <h3 class="text-base font-semibold text-gray-700">{title}</h3>
  {#if message}
    <p class="text-sm text-gray-500 mt-1 max-w-sm">{message}</p>
  {/if}
  {#if action && onaction}
    <button onclick={onaction} class="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition cursor-pointer">{action}</button>
  {/if}
</div>
