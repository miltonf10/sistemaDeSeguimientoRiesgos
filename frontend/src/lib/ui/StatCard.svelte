<script lang="ts">
  import Icon from '$lib/ui/Icon.svelte';

  let { label = '', value = '', icon = '', trend = null as number | null, color = 'blue', class: className = '' }: { label: string; value: string; icon?: string; trend?: number | null; color?: string; class?: string } = $props();

  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };
</script>

<div class="bg-white rounded-xl border border-gray-200 p-5 {className}">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p class="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {#if trend != null}
        <div class="flex items-center gap-1 mt-1 text-xs font-medium {trend >= 0 ? 'text-green-600' : 'text-red-600'}">
          <Icon name={trend >= 0 ? 'trending-up' : 'trending-down'} class="w-3.5 h-3.5" />
          <span>{trend >= 0 ? '+' : ''}{trend}%</span>
        </div>
      {/if}
    </div>
    {#if icon}
      <div class="w-10 h-10 rounded-lg flex items-center justify-center {colors[color] || colors.blue}">
        <Icon name={icon} class="w-5 h-5" />
      </div>
    {/if}
  </div>
</div>
