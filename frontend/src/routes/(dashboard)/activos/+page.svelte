<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client';
  import Card from '$lib/ui/Card.svelte';
  import DataTable from '$lib/ui/DataTable.svelte';
  import Icon from '$lib/ui/Icon.svelte';

  let activos = $state<any[]>([]);
  let loading = $state(true);

  onMount(load);

  async function load() {
    loading = true;
    try { activos = await api.activos.list(); }
    catch (e: any) { alert(e.message); }
    finally { loading = false; }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Desactivar este activo?')) return;
    try {
      await api.activos.remove(id);
      await load();
    } catch (e: any) { alert(e.message); }
  }

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
  function riskBadge(level: string) {
    const s = riskStyles[level] || 'bg-gray-50 text-gray-600 border-gray-200';
    const dot = riskDots[level];
    return `<span class="inline-flex items-center gap-1.5 font-medium rounded-full border text-xs px-2 py-0.5 ${s}">${dot ? `<span class="w-2 h-2 rounded-full" style="background-color:${dot}"></span>` : ''}${level || 'Sin clasificar'}</span>`;
  }

  const columns = [
    { key: 'identificador', label: 'ID', sortable: true, class: 'text-xs font-mono text-gray-500' },
    { key: 'nombre', label: 'Nombre', sortable: true, class: 'font-medium text-gray-900',
      render: (val: any, row: any) => `<span>${val}</span>` },
    { key: 'tipo', label: 'Tipo', sortable: true,
      render: (val: any, row: any) => `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">${val}${row.subTipo ? ` (${row.subTipo})` : ''}</span>` },
    { key: 'valorC', label: 'C', sortable: true, class: 'text-center',
      render: (v: any) => v != null ? `<span class="text-xs font-medium">${v}</span>` : '—' },
    { key: 'valorI', label: 'I', sortable: true, class: 'text-center',
      render: (v: any) => v != null ? `<span class="text-xs font-medium">${v}</span>` : '—' },
    { key: 'valorD', label: 'D', sortable: true, class: 'text-center',
      render: (v: any) => v != null ? `<span class="text-xs font-medium">${v}</span>` : '—' },
    { key: 'criticidad', label: 'Criticidad', sortable: true,
      render: (v: any) => riskBadge(v || '') },
    { key: 'dependencia', label: 'Dependencia',
      render: (_: any, row: any) => row.dependencia?.nombre || '—' },
    { key: 'activo', label: 'Estado',
      render: (v: any) => v
        ? '<span class="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Activo</span>'
        : '<span class="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>Inactivo</span>' },
  ];
</script>

<div class="max-w-7xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Activos de Información</h1>
      <p class="text-sm text-gray-500 mt-1">Inventario de activos — gestión documental, clasificación y datos personales</p>
    </div>
    <div class="flex items-center gap-3">
      <button onclick={load} class="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"><Icon name="refresh-cw" class="w-4 h-4" /> Actualizar</button>
      <a href="/activos/nuevo" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"><Icon name="plus" class="w-4 h-4" /> Nuevo Activo</a>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <DataTable {columns} data={activos} searchable={true} pageSize={10} />
  {/if}
</div>
