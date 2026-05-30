<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client';
  import Card from '$lib/ui/Card.svelte';
  import DataTable from '$lib/ui/DataTable.svelte';
  import Icon from '$lib/ui/Icon.svelte';

  let riesgos = $state<any[]>([]);
  let procesos = $state<any[]>([]);
  let activos = $state<any[]>([]);
  let loading = $state(true);

  let showForm = $state(false);
  let expandedId = $state<string | null>(null);
  let expandedData = $state<any>(null);
  let loadingDetail = $state(false);

  let form = $state({
    nombre: '',
    procesoId: '',
    activoId: '',
    causa: '',
    consecuencia: '',
    clasificacion: 'Operativo',
    tipoRiesgo: 'Interno',
  });

  async function load() {
    loading = true;
    try {
      const [r, p, a] = await Promise.all([
        api.riesgos.list(),
        api.procesos.list(),
        api.activos.list(),
      ]);
      riesgos = r;
      procesos = p;
      activos = a;
    } catch (e: any) {
      alert(e.message);
    } finally {
      loading = false;
    }
  }

  onMount(load);

  onMount(() => {
    (window as any).__deleteRiesgo = async (id: string) => {
      if (!confirm('¿Eliminar este riesgo?')) return;
      try {
        await api.riesgos.update(id, { estado: 'ELIMINADO' });
        await load();
      } catch (e: any) {
        alert(e.message);
      }
    };
    (window as any).__expandRiesgo = async (id: string) => {
      if (expandedId === id) {
        resetExpand();
        return;
      }
      loadingDetail = true;
      expandedId = id;
      expandedData = null;
      try {
        const riesgo = await api.riesgos.getById(id);
        const evals = await api.evaluaciones.findByRiesgo(id);
        const evalsWithControls = await Promise.all(
          evals.map(async (e: any) => {
            const controles = await api.controles.findByEvaluacion(e.id);
            return { ...e, controles };
          })
        );
        expandedData = { ...riesgo, evaluaciones: evalsWithControls };
      } catch (e: any) {
        alert(e.message);
      } finally {
        loadingDetail = false;
      }
    };
    return () => {
      delete (window as any).__deleteRiesgo;
      delete (window as any).__expandRiesgo;
    };
  });

  function resetForm() {
    form = { nombre: '', procesoId: '', activoId: '', causa: '', consecuencia: '', clasificacion: 'Operativo', tipoRiesgo: 'Interno' };
  }

  function openCreate() {
    resetForm();
    showForm = true;
    expandedId = null;
    expandedData = null;
  }

  async function handleCreate() {
    try {
      await api.riesgos.create(form);
      showForm = false;
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  function resetExpand() {
    expandedId = null;
    expandedData = null;
  }

  const clasificacionOptions = ['Estratégico', 'Operativo', 'Cumplimiento', 'Seguridad de la Información', 'Financiero', 'Tecnológico', 'Talento Humano'];
  const tipoRiesgoOptions = ['Interno', 'Externo'];

  const riskStyles: Record<string, string> = {
    IDENTIFICADO: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    ACTIVO: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    EN_EVALUACION: 'bg-blue-50 text-blue-700 border-blue-200',
    EN_EVALUACIÓN: 'bg-blue-50 text-blue-700 border-blue-200',
    TRATADO: 'bg-green-50 text-green-700 border-green-200',
    CERRADO: 'bg-green-50 text-green-700 border-green-200',
    ELIMINADO: 'bg-red-50 text-red-700 border-red-200',
  };

  function estadoBadge(e: string) {
    const s = riskStyles[e] || 'bg-gray-50 text-gray-600 border-gray-200';
    return `<span class="inline-flex items-center gap-1 font-medium rounded-full border text-xs px-2 py-0.5 ${s}">${e}</span>`;
  }

  const columns = [
    { key: 'nombre', label: 'Nombre', sortable: true,
      render: (v: any) => `<span class="font-medium text-gray-900">${v}</span>` },
    { key: 'proceso', label: 'Proceso',
      render: (_: any, r: any) => `<span class="text-sm text-gray-600">${r.proceso?.nombre || '-'}</span>` },
    { key: 'activo', label: 'Activo',
      render: (_: any, r: any) => `<span class="text-sm text-gray-600">${r.activo?.nombre || '-'}</span>` },
    { key: 'clasificacion', label: 'Clasificación', sortable: true,
      render: (v: any) => `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">${v}</span>` },
    { key: 'estado', label: 'Estado', sortable: true,
      render: (v: any) => estadoBadge(v || '') },
    { key: 'acciones', label: '', class: 'text-right',
      render: (_: any, r: any) => `<div class="flex gap-2 justify-end">
        <button onclick="window.__expandRiesgo('${r.id}')" class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium">Detalle</button>
        <button onclick="window.__deleteRiesgo('${r.id}')" class="text-xs text-red-600 hover:text-red-800 cursor-pointer font-medium">Eliminar</button>
      </div>` },
  ];
</script>

<div class="max-w-7xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Riesgos</h1>
      <p class="text-sm text-gray-500 mt-1">Identificación y valoración de riesgos</p>
    </div>
    <button onclick={openCreate} class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition cursor-pointer">
      <Icon name="plus" class="w-4 h-4" /> Nuevo Riesgo
    </button>
  </div>

  {#if showForm}
    <Card title="Nuevo Riesgo">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input bind:value={form.nombre} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Proceso</label>
          <select bind:value={form.procesoId} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
            <option value="">Seleccione...</option>
            {#each procesos as p}
              <option value={p.id}>{p.nombre}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Activo</label>
          <select bind:value={form.activoId} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
            <option value="">Seleccione...</option>
            {#each activos as a}
              <option value={a.id}>{a.nombre}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Clasificación</label>
          <select bind:value={form.clasificacion} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
            {#each clasificacionOptions as opt}
              <option value={opt}>{opt}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Riesgo</label>
          <select bind:value={form.tipoRiesgo} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
            {#each tipoRiesgoOptions as opt}
              <option value={opt}>{opt}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Causa</label>
          <textarea bind:value={form.causa} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" rows="2"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Consecuencia</label>
          <textarea bind:value={form.consecuencia} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" rows="2"></textarea>
        </div>
      </div>
      <div class="flex gap-3 mt-6">
        <button onclick={handleCreate} class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer font-medium">Guardar</button>
        <button onclick={() => { showForm = false; }} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">Cancelar</button>
      </div>
    </Card>
  {/if}

  {#if loading}
    <div class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <DataTable {columns} data={riesgos} searchable={true} pageSize={10} />

    {#if expandedId && loadingDetail}
      <div class="flex justify-center py-8">
        <div class="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    {/if}

    {#if expandedId && expandedData}
      <Card title="Detalle del Riesgo" icon="file-text">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><span class="font-medium text-gray-700">Causa:</span> {expandedData.causa || 'N/A'}</div>
            <div><span class="font-medium text-gray-700">Consecuencia:</span> {expandedData.consecuencia || 'N/A'}</div>
          </div>

          {#if expandedData.evaluaciones && expandedData.evaluaciones.length > 0}
            <h4 class="font-semibold text-gray-800 text-sm">Evaluaciones</h4>
            {#each expandedData.evaluaciones as ev}
              <div class="bg-white rounded-lg border border-gray-200 p-3 text-sm">
                <div class="grid grid-cols-4 gap-3 mb-2">
                  <div><span class="text-gray-500">Probabilidad:</span> <span class="font-medium">{ev.probabilidad}</span></div>
                  <div><span class="text-gray-500">Impacto:</span> <span class="font-medium">{ev.impacto}</span></div>
                  <div><span class="text-gray-500">Inherente:</span> <span class="font-medium">{ev.riesgoInherente}</span></div>
                  <div><span class="text-gray-500">Residual:</span> <span class="font-medium">{ev.nivelResidual || 'N/A'}</span></div>
                </div>
                {#if ev.controles && ev.controles.length > 0}
                  <div class="mt-2">
                    <span class="text-gray-500 text-xs font-medium">Controles:</span>
                    <div class="flex flex-wrap gap-2 mt-1">
                      {#each ev.controles as c}
                        <span class="inline-flex px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">{c.nombre}</span>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          {:else}
            <p class="text-sm text-gray-500 italic">Sin evaluaciones registradas</p>
          {/if}

          <button onclick={resetExpand} class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">Cerrar detalle</button>
        </div>
      </Card>
    {/if}
  {/if}
</div>
