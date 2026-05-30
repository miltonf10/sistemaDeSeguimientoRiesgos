<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { navStore } from '$lib/stores/nav.svelte';
  import { api } from '$lib/api/client';
  import Icon from '$lib/ui/Icon.svelte';

  let dependencias = $state<any[]>([]);
  let macroprocesos = $state<any[]>([]);
  let procesos = $state<any[]>([]);
  let usuarios = $state<any[]>([]);
  let activos = $state<any[]>([]);
  let riesgos = $state<any[]>([]);
  let loading = $state(true);
  let viewMode = $state<'mapa' | 'lista'>('mapa');
  let selectedProcesoId = $state<string | null>(null);
  let showCreateModal = $state(false);
  let detailTab = $state<'info' | 'activos' | 'riesgos'>('info');
  const tabs = ['info', 'activos', 'riesgos'] as const;

  const depMap = $derived(Object.fromEntries(dependencias.map(d => [d.id, d])));
  const macroMap = $derived(Object.fromEntries(macroprocesos.map(m => [m.id, m])));
  const userMap = $derived(Object.fromEntries(usuarios.map(u => [u.id, u])));

  const enrichedProcesos = $derived(
    procesos.filter(p => p.activo !== false).map(p => {
      const macro = macroMap[p.macroprocesoId];
      const dep = macro ? depMap[macro.dependenciaId] : null;
      return {
        ...p,
        dependenciaNombre: dep?.nombre || 'Sin asignar',
        dependenciaId: macro?.dependenciaId || '',
        responsableNombre: 'Sin asignar',
      };
    })
  );

  const selectedProceso = $derived(
    enrichedProcesos.find(p => p.id === selectedProcesoId) ?? null
  );

  const niveles = ['ESTRATEGICO', 'MISIONAL', 'APOYO', 'EVALUACION'] as const;

  const procesosByNivel = $derived(
    niveles.map(n => ({
      nivel: n,
      procesos: enrichedProcesos.filter(p => p.nivel === n),
    }))
  );

  const selectedActivos = $derived(
    activos.filter(a => a.procesoId === selectedProcesoId)
  );
  const selectedRiesgos = $derived(
    riesgos.filter(r => r.procesoId === selectedProcesoId)
  );

  const nivelConfig: Record<string, { header: string; text: string; bg: string; light: string; border: string; ring: string; icon: string }> = {
    ESTRATEGICO: { header: 'bg-blue-600', text: 'text-blue-700', bg: 'bg-blue-50', light: 'bg-blue-100', border: 'border-blue-200', ring: 'ring-blue-500', icon: 'flag' },
    MISIONAL: { header: 'bg-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50', light: 'bg-emerald-100', border: 'border-emerald-200', ring: 'ring-emerald-500', icon: 'users' },
    APOYO: { header: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50', light: 'bg-red-100', border: 'border-red-200', ring: 'ring-red-500', icon: 'settings' },
    EVALUACION: { header: 'bg-purple-600', text: 'text-purple-700', bg: 'bg-purple-50', light: 'bg-purple-100', border: 'border-purple-200', ring: 'ring-purple-500', icon: 'check-square' },
  };

  const nivelLabel: Record<string, string> = {
    ESTRATEGICO: 'Estratégico', MISIONAL: 'Misional', APOYO: 'Apoyo', EVALUACION: 'Evaluación',
  };

  let form = $state({ codigo: '', nombre: '', descripcion: '', nivel: '', dependenciaId: '', macroprocesoId: '', responsableId: '' });
  let creating = $state(false);

  const filteredMacros = $derived(
    form.dependenciaId ? macroprocesos.filter(m => m.dependenciaId === form.dependenciaId) : []
  );

  const pageIcon = $derived.by(() => {
    const fullPath = '/' + [$page.params.module, 'procesos'].filter(Boolean).join('/');
    const item = navStore.activeModule.nav.find(i => fullPath === i.route);
    return item?.icon || 'git-branch';
  });

  async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try { return await fn(); } catch (e) { console.warn('Fetch falló:', e); return fallback; }
  }

  onMount(async () => {
    const [deps, macros, procs, users, acts, ries] = await Promise.all([
      safeFetch(() => api.dependencias.list(), []),
      safeFetch(() => api.macroprocesos.list(), []),
      safeFetch(() => api.procesos.list(), []),
      safeFetch(() => api.usuarios.list(), []),
      safeFetch(() => api.activos.list(), []),
      safeFetch(() => api.riesgos.list(), []),
    ]);
    dependencias = deps;
    macroprocesos = macros;
    procesos = procs;
    usuarios = users;
    activos = acts;
    riesgos = ries;
    loading = false;
  });

  function selectProceso(id: string) {
    selectedProcesoId = id;
    detailTab = 'info';
  }

  function resetForm() {
    form = { codigo: '', nombre: '', descripcion: '', nivel: '', dependenciaId: '', macroprocesoId: '', responsableId: '' };
  }

  async function handleCreate() {
    if (!form.nombre || !form.nivel || !form.macroprocesoId) return;
    creating = true;
    try {
      await api.procesos.create({
        nombre: form.nombre,
        codigo: form.codigo || undefined,
        nivel: form.nivel,
        macroprocesoId: form.macroprocesoId,
      });
      procesos = await api.procesos.list();
      showCreateModal = false;
      resetForm();
    } catch (e) {
      console.error('Error creando proceso:', e);
    } finally {
      creating = false;
    }
  }

  function formatDate(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }
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
        <h1 class="text-xl font-bold text-gray-900">Procesos</h1>
        <p class="text-sm text-gray-500">{navStore.activeModule.description}</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <!-- View toggle -->
      <div class="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
        <button
          onclick={() => viewMode = 'mapa'}
          class="px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer flex items-center gap-1.5"
          class:bg-white={viewMode === 'mapa'}
          class:text-gray={viewMode === 'mapa'}
          class:shadow-sm={viewMode === 'mapa'}
          class:text-gray-600={viewMode !== 'mapa'}
        >
          <Icon name="pie-chart" class="w-3.5 h-3.5" />
          Mapa
        </button>
        <button
          onclick={() => viewMode = 'lista'}
          class="px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer flex items-center gap-1.5"
          class:bg-white={viewMode === 'lista'}
          class:shadow-sm={viewMode === 'lista'}
          class:text-gray-600={viewMode !== 'lista'}
        >
          <Icon name="list" class="w-3.5 h-3.5" />
          Lista
        </button>
      </div>
      <button
        onclick={() => showCreateModal = true}
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition cursor-pointer"
        style="background-color: var(--color-module-primary);"
      >
        <Icon name="plus" class="w-3.5 h-3.5" />
        Crear
      </button>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="flex gap-6">
      <!-- Left / Main Panel -->
      <div class="flex-1 min-w-0 space-y-4">
        {#if viewMode === 'mapa'}
          <!-- Vista Mapa - Diagrama Institucional -->
          <div class="max-w-5xl mx-auto w-full">
            {#each procesosByNivel as group, i}
              <div
                class="p-6 {nivelConfig[group.nivel].bg} {nivelConfig[group.nivel].border} border"
                class:rounded-t-2xl={i === 0}
                class:rounded-b-2xl={i === procesosByNivel.length - 1}
              >
                <h3 class="text-xs font-bold {nivelConfig[group.nivel].text} uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Icon name={nivelConfig[group.nivel].icon} class="w-4 h-4" />
                  Nivel {nivelLabel[group.nivel]}
                </h3>
                {#if group.procesos.length === 0}
                  <p class="text-xs {nivelConfig[group.nivel].text} opacity-60 italic py-2">Sin procesos en este nivel</p>
                {:else}
                  <div class="flex flex-wrap gap-3">
                    {#each group.procesos as p}
                      <button
                        onclick={() => selectProceso(p.id)}
                        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border transition cursor-pointer hover:shadow-md min-w-[200px] flex-1 max-w-[320px] text-left"
                        style={selectedProcesoId === p.id
                          ? 'border-color: var(--color-module-primary); box-shadow: 0 0 0 2px var(--color-module-primary);'
                          : 'border-color: #e5e7eb;'}
                      >
                        <div class="w-9 h-9 rounded-lg {nivelConfig[group.nivel].light} flex items-center justify-center shrink-0">
                          <Icon name={nivelConfig[group.nivel].icon} class="w-4 h-4 {nivelConfig[group.nivel].text}" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-gray-900 truncate leading-tight">{p.nombre}</p>
                          <p class="text-xs text-gray-400 font-mono mt-0.5">{p.codigo || '—'}</p>
                        </div>
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
              {#if i < procesosByNivel.length - 1}
                <div class="flex justify-center py-1.5">
                  <Icon name="arrow-down" class="w-5 h-5 text-gray-300" />
                </div>
              {/if}
            {/each}
          </div>
        {:else}
          <!-- Vista Lista -->
          <div class="bg-white rounded-xl border border-gray-200/80 shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                    <th class="px-4 py-3 font-medium">Código</th>
                    <th class="px-4 py-3 font-medium">Nombre</th>
                    <th class="px-4 py-3 font-medium">Nivel</th>
                    <th class="px-4 py-3 font-medium">Dependencia</th>
                  </tr>
                </thead>
                <tbody>
                  {#each enrichedProcesos as p}
                    <tr
                      onclick={() => selectProceso(p.id)}
                      class="border-b border-gray-50 transition cursor-pointer"
                      class:bg-gray-50={selectedProcesoId === p.id}
                      style={selectedProcesoId === p.id ? 'box-shadow: inset 3px 0 0 var(--color-module-primary);' : ''}
                    >
                      <td class="px-4 py-3 text-gray-500 font-mono text-xs">{p.codigo || '—'}</td>
                      <td class="px-4 py-3 text-gray-900 font-medium">{p.nombre}</td>
                      <td class="px-4 py-3">
                        <span
                          class="inline-flex px-2 py-0.5 text-xs font-medium rounded-full {nivelConfig[p.nivel]?.light || 'bg-gray-100'} {nivelConfig[p.nivel]?.text || 'text-gray-600'}"
                        >
                          {nivelLabel[p.nivel] || p.nivel}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-gray-600">{p.dependenciaNombre}</td>
                    </tr>
                  {:else}
                    <tr>
                      <td colspan="4" class="px-4 py-12 text-center text-gray-400 italic">
                        No hay procesos registrados
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}
      </div>

      <!-- Right: Detail Panel -->
      {#if selectedProceso}
        <div class="w-96 shrink-0">
          <div class="bg-white rounded-xl border border-gray-200/80 shadow-sm sticky top-0">
            <!-- Detail header -->
            <div
              class="px-4 py-3 rounded-t-xl flex items-center justify-between"
              style="background-color: color-mix(in srgb, var(--color-module-primary) 6%, transparent);"
            >
              <div class="flex items-center gap-2 min-w-0">
                <div
                  class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style="background-color: color-mix(in srgb, var(--color-module-primary) 12%, transparent);"
                >
                  <Icon name={pageIcon} class="w-3.5 h-3.5" style="color: var(--color-module-primary);" />
                </div>
                <h3 class="text-sm font-semibold text-gray-900 truncate">{selectedProceso.nombre}</h3>
              </div>
              <button
                onclick={() => selectedProcesoId = null}
                class="p-1 rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                <Icon name="x" class="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <!-- Tabs -->
            <div class="flex border-b border-gray-100 px-3">
              {#each tabs as tab}
                <button
                  onclick={() => detailTab = tab}
                  class="px-3 py-2 text-xs font-medium border-b-2 transition cursor-pointer"
                  style={detailTab === tab ? 'border-color: var(--color-module-primary); color: var(--color-module-primary);' : 'border-color: transparent; color: #6b7280;'}
                >
                  {tab === 'info' ? 'Información' : tab === 'activos' ? `Activos (${selectedActivos.length})` : `Riesgos (${selectedRiesgos.length})`}
                </button>
              {/each}
            </div>

            <!-- Tab content -->
            <div class="p-4 max-h-[500px] overflow-y-auto">
              {#if detailTab === 'info'}
                <div class="space-y-3 text-sm">
                  {#if selectedProceso.codigo}
                    <div>
                      <p class="text-xs text-gray-400 font-medium">Código</p>
                      <p class="text-gray-900 font-mono">{selectedProceso.codigo}</p>
                    </div>
                  {/if}
                  <div>
                    <p class="text-xs text-gray-400 font-medium">Nivel</p>
                    <span
                      class="inline-flex px-2 py-0.5 mt-0.5 text-xs font-medium rounded-full {nivelConfig[selectedProceso.nivel]?.light || 'bg-gray-100'} {nivelConfig[selectedProceso.nivel]?.text || 'text-gray-600'}"
                    >
                      {nivelLabel[selectedProceso.nivel] || selectedProceso.nivel}
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 font-medium">Dependencia</p>
                    <p class="text-gray-900">{selectedProceso.dependenciaNombre}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 font-medium">Macroproceso</p>
                    <p class="text-gray-900">{macroMap[selectedProceso.macroprocesoId]?.nombre || '—'}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 font-medium">Responsable</p>
                    <p class="text-gray-900">{selectedProceso.responsableNombre}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 font-medium">Fecha de creación</p>
                    <p class="text-gray-900">{formatDate(selectedProceso.createdAt)}</p>
                  </div>
                </div>
              {:else if detailTab === 'activos'}
                {#if selectedActivos.length === 0}
                  <p class="text-xs text-gray-400 italic text-center py-8">Sin activos asociados</p>
                {:else}
                  <div class="space-y-2">
                    {#each selectedActivos as a}
                      <div class="p-3 rounded-lg border border-gray-100 bg-gray-50">
                        <p class="text-sm font-medium text-gray-900">{a.nombre}</p>
                        <div class="flex items-center gap-2 mt-1">
                          <span class="text-xs text-gray-500">{a.tipo}</span>
                          {#if a.responsable}
                            <span class="text-xs text-gray-400">· {a.responsable.nombre}</span>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              {:else}
                {#if selectedRiesgos.length === 0}
                  <p class="text-xs text-gray-400 italic text-center py-8">Sin riesgos asociados</p>
                {:else}
                  <div class="space-y-2">
                    {#each selectedRiesgos as r}
                      <div class="p-3 rounded-lg border border-gray-100 bg-gray-50">
                        <p class="text-sm font-medium text-gray-900">{r.nombre}</p>
                        <div class="flex items-center gap-2 mt-1">
                          <span class="text-xs text-gray-500">{r.estado}</span>
                          {#if r.clasificacion}
                            <span class="text-xs text-gray-400">· {r.clasificacion}</span>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- Create Modal -->
{#if showCreateModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onclick={() => showCreateModal = false}
    role="dialog"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-sm font-semibold text-gray-900">Crear Proceso</h2>
        <button onclick={() => { showCreateModal = false; resetForm(); }} class="p-1 rounded-md hover:bg-gray-100 transition cursor-pointer">
          <Icon name="x" class="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div class="p-5 space-y-4">
        <!-- Código -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Código</label>
          <input bind:value={form.codigo} placeholder="Ej: PROC-001" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:border-transparent" style="--tw-ring-color: var(--color-module-primary);" />
        </div>

        <!-- Nombre -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Nombre <span class="text-red-400">*</span></label>
          <input bind:value={form.nombre} placeholder="Nombre del proceso" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2" />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
          <textarea bind:value={form.descripcion} rows={3} placeholder="Descripción del proceso" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none resize-none"></textarea>
        </div>

        <!-- Nivel -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Nivel <span class="text-red-400">*</span></label>
          <select bind:value={form.nivel} class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-white">
            <option value="">Seleccionar nivel</option>
            {#each niveles as n}
              <option value={n}>{nivelLabel[n]}</option>
            {/each}
          </select>
        </div>

        <!-- Dependencia -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Dependencia</label>
          <select
            bind:value={form.dependenciaId}
            onchange={() => { form.macroprocesoId = ''; }}
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-white"
          >
            <option value="">Seleccionar dependencia</option>
            {#each dependencias as d}
              <option value={d.id}>{d.nombre}</option>
            {/each}
          </select>
        </div>

        <!-- Macroproceso (filtrado por dependencia) -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Macroproceso <span class="text-red-400">*</span></label>
          <select bind:value={form.macroprocesoId} class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-white" disabled={!form.dependenciaId}>
            <option value="">{form.dependenciaId ? 'Seleccionar macroproceso' : 'Primero selecciona una dependencia'}</option>
            {#each filteredMacros as m}
              <option value={m.id}>{m.nombre}</option>
            {/each}
          </select>
        </div>

        <!-- Responsable -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Responsable</label>
          <select bind:value={form.responsableId} class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-white">
            <option value="">Seleccionar responsable</option>
            {#each usuarios.filter(u => u.activo !== false) as u}
              <option value={u.id}>{u.nombre} {u.cargo ? `(${u.cargo})` : ''}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
        <button
          onclick={() => { showCreateModal = false; resetForm(); }}
          class="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onclick={handleCreate}
          disabled={creating || !form.nombre || !form.nivel || !form.macroprocesoId}
          class="px-4 py-2 text-xs font-medium text-white rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style="background-color: var(--color-module-primary);"
        >
          {creating ? 'Creando...' : 'Crear Proceso'}
        </button>
      </div>
    </div>
  </div>
{/if}
