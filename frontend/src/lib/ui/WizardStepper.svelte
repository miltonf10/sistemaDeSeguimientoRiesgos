<script lang="ts">
  import Icon from '$lib/ui/Icon.svelte';

  let { steps = [] as string[], current = 1 }: { steps: string[]; current: number } = $props();

  const total = $derived(steps.length);
  const pct = $derived(Math.round(((current - 1) / total) * 100));
</script>

<div class="w-full">
  <div class="flex items-center justify-between mb-4">
    {#each steps as step, i}
      <div class="flex items-center flex-1">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 
            {i + 1 < current ? 'bg-green-500 text-white' : i + 1 === current ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-100 text-gray-400'}">
            {#if i + 1 < current}
              <Icon name="check" class="w-4 h-4" />
            {:else}
              {i + 1}
            {/if}
          </div>
          <span class="text-xs mt-1.5 font-medium {i + 1 <= current ? 'text-gray-700' : 'text-gray-400'}">{step}</span>
        </div>
        {#if i < steps.length - 1}
          <div class="flex-1 h-0.5 mx-3 rounded transition-all duration-300 {i + 1 < current ? 'bg-green-500' : 'bg-gray-200'}"></div>
        {/if}
      </div>
    {/each}
  </div>
  <div class="w-full bg-gray-200 rounded-full h-1.5 mb-2">
    <div class="bg-primary h-1.5 rounded-full transition-all duration-500" style="width: {pct}%"></div>
  </div>
</div>
