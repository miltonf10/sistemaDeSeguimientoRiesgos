<script lang="ts">
  import Icon from '$lib/ui/Icon.svelte';
  let { title = '', icon = '', padding = true, class: className = '', children }: { title?: string; icon?: string; padding?: boolean; class?: string; children: import('svelte').Snippet } = $props();
</script>

<div class="bg-white rounded-xl border border-gray-200/80 shadow-sm {className}">
  {#if title || icon}
    <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
      {#if icon}<Icon name={icon} class="w-5 h-5 text-gray-500" />{/if}
      <h3 class="text-sm font-semibold text-gray-900">{title}</h3>
    </div>
  {/if}
  <div class={padding ? 'p-5' : ''}>
    {@render children()}
  </div>
</div>
