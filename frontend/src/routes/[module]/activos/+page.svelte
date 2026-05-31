<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { navStore } from '$lib/stores/nav.svelte';
  import { api } from '$lib/api/client';
  import DataTable from '$lib/ui/DataTable.svelte';
  import Icon from '$lib/ui/Icon.svelte';

  let activos = $state<any[]>([]);
  let loading = $state(true);

  const riskStyles: Record<string, string> = {
    Alto: 'bg-red-50 text-red-700 border-red-200',
    Medio: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Baja: 'bg-green-50 text-green-700 border-green-200',
    Bajo: 'bg-green-50 text-green-700 border-green-200',
    Alta: 'bg-red-50 text-red-700 border-red-200',
    Media: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };
  const riskDots: Record<string, string> = {
    Alto: '#EB5757', Medio: '#F2C94C', Baja: '#27AE60',
    Bajo: '#27AE60', Alta: '#EB5757', Media: '#F2C94C',
  };

  const pageIcon = $derived.by(() => {
    const fullPath = '/' + [$page.params.module, 'activos'].filter(Boolean).join('/');
    const item = navStore.activeModule?.nav?.find(i => fullPath === i.route);
    return item?.icon || 'server';
  });

  const columns = [
    { key: 'identificador', label: 'ID', sortable: true, class: 'text-xs font-mono text-gray-500' },
    { key: 'nombre', label: 'Nombre', sortable: true, class: 'font-medium text-gray-900' },
    { key: 'tipo', label: 'Tipo', sortable: true,
      render: (val: any) => `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">${val}</span>` },
    { key: 'valorC', label: 'C', sortable: true, class: 'text-center',
      render: (v: any) => v != null ? `<span class="text-xs font-medium">${v}</span>` : '—' },
    { key: 'valorI', label: 'I', sortable: true, class: 'text-center',
      render: (v: any) => v != null ? `<span class="text-xs font-medium">${v}</span>` : '—' },
    { key: 'valorD', label: 'D', sortable: true, class: 'text-center',
      render: (v: any) => v != null ? `<span class="text-xs font-medium">${v}</span>` : '—' },
    { key: 'criticidad', label: 'Criticidad', sortable: true,
      render: (v: any) => {
        const s = riskStyles[v] || 'bg-gray-50 text-gray-600 border-gray-200';
        const dot = riskDots[v];
        return `<span class="inline-flex items-center gap-1.5 font-medium rounded-full border text-xs px-2 py-0.5 ${s}">${dot ? `<span class="w-2 h-2 rounded-full" style="background-color:${dot}"></span>` : ''}${v || 'Sin clasificar'}</span>`;
      } },
    { key: 'dependencia', label: 'Dependencia',
      render: (_: any, row: any) => row.dependencia?.nombre || '—' },
    { key: 'activo', label: 'Estado',
      render: (v: any) => v
        ? '<span class="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Activo</span>'
        : '<span class="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>Inactivo</span>' },
    { key: 'acciones', label: '', class: 'text-right',
      render: (_: any, row: any) => `<div class="flex gap-2 justify-end">
        <button onclick="window.__editActivo('${row.id}')" class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition cursor-pointer">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          Editar
        </button>
      </div>` },
  ];

  const baseEditUrl = $derived(`/${$page.params.module}/activos/nuevo?id=`);

  async function load() {
    loading = true;
    try { activos = await api.activos.list(); }
    catch (e: any) { console.error(e); }
    finally { loading = false; }
  }

  onMount(() => {
    (window as any).__editActivo = (id: string) => {
      window.location.href = baseEditUrl + id;
    };
    load();
    return () => { delete (window as any).__editActivo; };
  });
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center"
        style="background-color: color-mix(in srgb, var(--color-module-primary) 8%, transparent);"
      >
        <Icon name={pageIcon} class="w-5 h-5" style="color: var(--color-module-primary);" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-gray-900">Activos de Información</h1>
        <p class="text-sm text-gray-500">{navStore.activeModule?.description || ''}</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button
        onclick={load}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
      >
        <Icon name="refresh-cw" class="w-3.5 h-3.5" />
        Actualizar
      </button>
      <a
        href="/{$page.params.module}/activos/nuevo"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition"
        style="background-color: var(--color-module-primary);"
      >
        <Icon name="plus" class="w-3.5 h-3.5" />
        Nuevo Activo
      </a>
    </div>
  </div>

  <!-- Table -->
  {#if loading}
    <div class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  {:else}
    <DataTable {columns} data={activos} searchable={true} pageSize={10} />
  {/if}
</div>