<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { navStore } from '$lib/stores/nav.svelte';
  import { api } from '$lib/api/client';
  import DataTable from '$lib/ui/DataTable.svelte';
  import Icon from '$lib/ui/Icon.svelte';

  let activos = $state<any[]>([]);
  let loading = $state(true);

  let showModal = $state(false);
  let exporting = $state(false);

  let dependencias = $state<any[]>([]);
  let macroprocesos = $state<any[]>([]);
  let procesos = $state<any[]>([]);

  let filtros = $state({
    dependenciaId: '',
    macroprocesoId: '',
    procesoId: '',
    tipo: '',
    criticidad: '',
    fechaDesde: '',
    fechaHasta: '',
  });

  const tipos = [
    'Hardware', 'Software', 'Base de Datos', 'Documento', 'Aplicación',
    'Servicio Tecnológico', 'Infraestructura Tecnológica', 'Equipo de Comunicaciones',
    'Información Física', 'Información Digital', 'Medio Magnético', 'Repositorio Digital',
  ];

  const criticidades = ['Baja', 'Media', 'Alta', 'Muy Alta', 'Crítica'];

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

  async function loadDependencias() {
    try { dependencias = await api.dependencias.list(); }
    catch (e: any) { console.error(e); }
  }

  async function onDependenciaChange() {
    filtros.macroprocesoId = '';
    filtros.procesoId = '';
    macroprocesos = [];
    procesos = [];
    if (!filtros.dependenciaId) return;
    try { macroprocesos = await api.macroprocesos.findByDependencia(filtros.dependenciaId); }
    catch (e: any) { console.error(e); }
  }

  async function onMacroprocesoChange() {
    filtros.procesoId = '';
    procesos = [];
    if (!filtros.macroprocesoId) return;
    try {
      const all = await api.procesos.list();
      procesos = all.filter((p: any) => p.macroprocesoId === filtros.macroprocesoId);
    } catch (e: any) { console.error(e); }
  }

  function limpiarFiltros() {
    filtros = { dependenciaId: '', macroprocesoId: '', procesoId: '', tipo: '', criticidad: '', fechaDesde: '', fechaHasta: '' };
    macroprocesos = [];
    procesos = [];
  }

  async function handleExportar() {
    exporting = true;
    try {
      const blob = await api.reportes.exportarActivosExcel(filtros);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      a.download = `Inventario_Activos_Informacion_${fecha}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showModal = false;
    } catch (e: any) {
      alert(e.message);
    } finally { exporting = false; }
  }

  onMount(() => {
    (window as any).__editActivo = (id: string) => {
      window.location.href = baseEditUrl + id;
    };
    load();
    loadDependencias();
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
      <button
        onclick={() => showModal = true}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
      >
        <Icon name="file-down" class="w-3.5 h-3.5" />
        Exportar Excel
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

<!-- Modal filtros -->
{#if showModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onclick={() => showModal = false}>
    <div class="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg mx-4" onclick={(e) => e.stopPropagation()}>
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <Icon name="file-down" class="w-5 h-5" style="color: var(--color-module-primary);" />
          <h2 class="text-base font-semibold text-gray-900">Exportar Inventario de Activos</h2>
        </div>
        <button onclick={() => showModal = false} class="text-gray-400 hover:text-gray-600 transition cursor-pointer p-1">
          <Icon name="x" class="w-5 h-5" />
        </button>
      </div>

      <div class="px-6 py-4 space-y-4">
        <p class="text-xs text-gray-500">Filtros opcionales — si no selecciona ninguno se exportarán todos los activos.</p>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Dependencia</label>
          <select bind:value={filtros.dependenciaId} onchange={onDependenciaChange}
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Todas</option>
            {#each dependencias as d}
              <option value={d.id}>{d.nombre}</option>
            {/each}
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Macroproceso</label>
            <select bind:value={filtros.macroprocesoId} onchange={onMacroprocesoChange}
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Todos</option>
              {#each macroprocesos as m}
                <option value={m.id}>{m.nombre}</option>
              {/each}
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Proceso</label>
            <select bind:value={filtros.procesoId}
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Todos</option>
              {#each procesos as p}
                <option value={p.id}>{p.nombre}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tipo de activo</label>
            <select bind:value={filtros.tipo}
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Todos</option>
              {#each tipos as t}
                <option>{t}</option>
              {/each}
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Criticidad</label>
            <select bind:value={filtros.criticidad}
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Todas</option>
              {#each criticidades as c}
                <option>{c}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Fecha desde</label>
            <input type="date" bind:value={filtros.fechaDesde}
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Fecha hasta</label>
            <input type="date" bind:value={filtros.fechaHasta}
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <button onclick={limpiarFiltros}
          class="text-xs text-gray-500 hover:text-gray-700 transition cursor-pointer underline underline-offset-2">
          Limpiar filtros
        </button>
        <div class="flex items-center gap-2">
          <button onclick={() => showModal = false}
            class="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            Cancelar
          </button>
          <button onclick={handleExportar} disabled={exporting}
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white rounded-lg transition cursor-pointer disabled:opacity-60"
            style="background-color: var(--color-module-primary);">
            {#if exporting}
              <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Exportando...
            {:else}
              <Icon name="file-down" class="w-3.5 h-3.5" />
              Exportar
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
