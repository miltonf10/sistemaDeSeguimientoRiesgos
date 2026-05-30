<script lang="ts">
  let { data = [] as { x: string; y: string; value: number; label?: string }[], class: className = '' }: {
    data: { x: string; y: string; value: number; label?: string }[];
    class?: string;
  } = $props();

  const xs = $derived([...new Set(data.map(d => d.x))]);
  const ys = $derived([...new Set(data.map(d => d.y))]);

  function color(v: number): string {
    if (v >= 15) return 'bg-red-500 text-white';
    if (v >= 10) return 'bg-red-400 text-white';
    if (v >= 8) return 'bg-orange-400 text-white';
    if (v >= 5) return 'bg-yellow-400 text-gray-900';
    if (v >= 3) return 'bg-lime-400 text-gray-900';
    return 'bg-green-400 text-gray-900';
  }

  function size(v: number): number {
    return Math.max(32, Math.min(60, 28 + v * 2));
  }
</script>

<div class="overflow-x-auto {className}">
  <div class="inline-block min-w-fit">
    <div class="grid gap-1.5" style="grid-template-columns: 100px repeat({xs.length}, 1fr);">
      <div></div>
      {#each xs as x}
        <div class="text-xs font-medium text-gray-500 text-center pb-1 truncate" title={x}>{x}</div>
      {/each}
      {#each ys as y}
        <div class="text-xs font-medium text-gray-600 truncate pr-2 flex items-center" title={y}>{y}</div>
        {#each xs as x}
          {@const cell = data.find(d => d.x === x && d.y === y)}
          {#if cell}
              <div class="rounded-lg flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 cursor-default {color(cell.value)}" style="height: {size(cell.value)}px" title="{cell.label || `${x} - ${y}: ${cell.value}`}">
              {cell.value}
            </div>
          {:else}
            <div class="rounded-lg bg-gray-50" style="height: 32px"></div>
          {/if}
        {/each}
      {/each}
    </div>
  </div>
</div>
