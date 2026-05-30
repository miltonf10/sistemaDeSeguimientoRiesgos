<script lang="ts">
  import Icon from '$lib/ui/Icon.svelte';

  let { columns = [] as { key: string; label: string; sortable?: boolean; class?: string; render?: (val: any, row: any) => any }[], data = [] as any[], searchable = true, pageSize = 10, class: className = '' }: {
    columns: { key: string; label: string; sortable?: boolean; class?: string; render?: (val: any, row: any) => any }[];
    data: any[];
    searchable?: boolean;
    pageSize?: number;
    class?: string;
  } = $props();

  let search = $state('');
  let sortKey = $state('');
  let sortDir = $state<'asc' | 'desc'>('asc');
  let page = $state(1);

  let filtered = $derived.by(() => {
    let d = [...data];
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(row =>
        columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      d.sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        return av < bv ? -1 : av > bv ? 1 : 0;
      });
      if (sortDir === 'desc') d.reverse();
    }
    return d;
  });

  let totalPages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
  let paged = $derived(filtered.slice((page - 1) * pageSize, page * pageSize));

  function toggleSort(key: string) {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDir = 'asc';
    }
  }
</script>

<div class="bg-white rounded-xl border border-gray-200 overflow-hidden {className}">
  {#if searchable}
    <div class="relative px-4 py-3 border-b border-gray-100">
      <Icon name="search" class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input type="text" bind:value={search} placeholder="Buscar..."
        class="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-gray-50/50" />
    </div>
  {/if}
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-50/80">
          {#each columns as col}
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider {col.class || ''}">
              {#if col.sortable}
                <button onclick={() => toggleSort(col.key)} class="inline-flex items-center gap-1 hover:text-gray-700 transition cursor-pointer">
                  {col.label}
                  {#if sortKey === col.key}
                    {#if sortDir === 'asc'}<Icon name="arrow-up" class="w-3.5 h-3.5" />{:else}<Icon name="arrow-down" class="w-3.5 h-3.5" />{/if}
                  {:else}
                    <Icon name="arrow-up-down" class="w-3.5 h-3.5 text-gray-300" />
                  {/if}
                </button>
              {:else}
                {col.label}
              {/if}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each paged as row, i}
            <tr class="border-t border-gray-100 hover:bg-gray-50/50 transition {i % 2 === 0 ? 'bg-gray-50/30' : ''}">
            {#each columns as col}
              <td class="px-4 py-3 text-sm {col.class || ''}">
                {#if col.render}
                  {@const rendered = col.render(row[col.key], row)}
                  {#if rendered != null}
                    {@html rendered}
                  {:else}
                    &mdash;
                  {/if}
                {:else}
                  {row[col.key] ?? '—'}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if totalPages > 1}
    <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
      <span class="text-xs text-gray-500">Página {page} de {totalPages}</span>
      <div class="flex items-center gap-2">
        <button onclick={() => page = Math.max(1, page - 1)} disabled={page <= 1}
          class="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer">
          <Icon name="chevron-left" class="w-4 h-4" />
        </button>
        {#each Array(totalPages) as _, i}
          <button onclick={() => page = i + 1}
            class="w-8 h-8 text-xs font-medium rounded-lg transition cursor-pointer {page === i + 1 ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}">
            {i + 1}
          </button>
        {/each}
        <button onclick={() => page = Math.min(totalPages, page + 1)} disabled={page >= totalPages}
          class="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer">
          <Icon name="chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>
  {/if}
</div>
