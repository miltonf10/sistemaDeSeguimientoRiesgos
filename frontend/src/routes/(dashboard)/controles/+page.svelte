<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client';
  import Card from '$lib/ui/Card.svelte';
  import DataTable from '$lib/ui/DataTable.svelte';
  import Icon from '$lib/ui/Icon.svelte';

  let controles = $state<any[]>([]);
  let evaluaciones = $state<any[]>([]);
  let usuarios = $state<any[]>([]);
  let loading = $state(true);

  let showForm = $state(false);
  let editingId = $state<string | null>(null);
  let form = $state({
    nombre: '',
    descripcion: '',
    tipoControl: 'PREVENTIVO',
    frecuencia: '',
    eficacia: 80,
    responsableId: '',
    evaluacionId: '',
  });

  async function load() {
    loading = true;
    try {
      const [c, u] = await Promise.all([
        api.controles.list(),
        api.usuarios.list(),
      ]);
      controles = c;
      usuarios = u;
    } catch {
      controles = [];
      usuarios = [];
    }
    try {
      evaluaciones = await api.evaluaciones.findByRiesgo('');
    } catch {
      evaluaciones = [];
    }
    loading = false;
  }

  onMount(load);

  onMount(() => {
    (window as any).__editControl = (id: string) => {
      const c = controles.find(cn => cn.id === id);
      if (c) {
        form = {
          nombre: c.nombre,
          descripcion: c.descripcion || '',
          tipoControl: c.tipoControl,
          frecuencia: c.frecuencia,
          eficacia: c.eficacia,
          responsableId: c.responsableId,
          evaluacionId: c.evaluacionId,
        };
        editingId = c.id;
        showForm = true;
      }
    };
    (window as any).__deleteControl = async (id: string) => {
      if (!confirm('¿Eliminar este control?')) return;
      try {
        await api.controles.remove(id);
        await load();
      } catch (e: any) {
        alert(e.message);
      }
    };
    return () => {
      delete (window as any).__editControl;
      delete (window as any).__deleteControl;
    };
  });

  function resetForm() {
    form = { nombre: '', descripcion: '', tipoControl: 'PREVENTIVO', frecuencia: '', eficacia: 80, responsableId: '', evaluacionId: '' };
    editingId = null;
  }

  function openCreate() {
    resetForm();
    showForm = true;
  }

  async function handleSave() {
    try {
      if (editingId) {
        await api.controles.update(editingId, form);
      } else {
        await api.controles.create(form);
      }
      showForm = false;
      editingId = null;
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  const tipoControlOptions = ['PREVENTIVO', 'DETECTIVO', 'CORRECTIVO'];

  const tipoStyles: Record<string, string> = {
    PREVENTIVO: 'bg-blue-50 text-blue-700 border-blue-200',
    DETECTIVO: 'bg-amber-50 text-amber-700 border-amber-200',
    CORRECTIVO: 'bg-red-50 text-red-700 border-red-200',
  };

  function tipoBadge(t: string) {
    const s = tipoStyles[t] || 'bg-gray-50 text-gray-600 border-gray-200';
    return `<span class="inline-flex items-center gap-1 font-medium rounded-full border text-xs px-2 py-0.5 ${s}">${t}</span>`;
  }

  function eficaciaClass(e: number) {
    return e >= 80 ? 'text-green-600 font-semibold' : e >= 50 ? 'text-yellow-600 font-semibold' : 'text-red-600 font-semibold';
  }

  const columns = [
    { key: 'nombre', label: 'Nombre', sortable: true,
      render: (v: any) => `<span class="font-medium text-gray-900">${v}</span>` },
    { key: 'tipoControl', label: 'Tipo', sortable: true,
      render: (v: any) => tipoBadge(v) },
    { key: 'frecuencia', label: 'Frecuencia',
      render: (v: any) => `<span class="text-sm text-gray-600">${v || '-'}</span>` },
    { key: 'eficacia', label: 'Eficacia', sortable: true,
      render: (v: any) => `<span class="text-sm font-semibold ${eficaciaClass(v)}">${v}%</span>` },
    { key: 'responsable', label: 'Responsable',
      render: (_: any, r: any) => `<span class="text-sm text-gray-600">${r.responsable?.nombre || '-'}</span>` },
    { key: 'acciones', label: '', class: 'text-right',
      render: (_: any, r: any) => `<div class="flex gap-2 justify-end">
        <button onclick="window.__editControl('${r.id}')" class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium">Editar</button>
        <button onclick="window.__deleteControl('${r.id}')" class="text-xs text-red-600 hover:text-red-800 cursor-pointer font-medium">Eliminar</button>
      </div>` },
  ];
</script>

<div class="max-w-7xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Controles</h1>
      <p class="text-sm text-gray-500 mt-1">Gestión de controles de riesgo</p>
    </div>
    <button onclick={openCreate} class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition cursor-pointer">
      <Icon name="plus" class="w-4 h-4" /> Nuevo Control
    </button>
  </div>

  {#if showForm}
    <Card title="{editingId ? 'Editar' : 'Nuevo'} Control" icon="shield-check">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input bind:value={form.nombre} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input bind:value={form.descripcion} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Control</label>
          <select bind:value={form.tipoControl} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
            {#each tipoControlOptions as opt}
              <option value={opt}>{opt}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
          <input bind:value={form.frecuencia} placeholder="Ej: Mensual, Trimestral" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Eficacia (0-100)</label>
          <input type="number" min="0" max="100" bind:value={form.eficacia} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
          <select bind:value={form.responsableId} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
            <option value="">Seleccione...</option>
            {#each usuarios as u}
              <option value={u.id}>{u.nombre}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Evaluación</label>
          <select bind:value={form.evaluacionId} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
            <option value="">Seleccione...</option>
            {#each evaluaciones as e}
              <option value={e.id}>Evaluación #{e.id.slice(0, 8)}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="flex gap-3 mt-6">
        <button onclick={handleSave} class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer font-medium">
          {editingId ? 'Actualizar' : 'Guardar'}
        </button>
        <button onclick={() => { showForm = false; }} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">Cancelar</button>
      </div>
    </Card>
  {/if}

  {#if loading}
    <div class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <DataTable {columns} data={controles} searchable={true} pageSize={10} />
  {/if}
</div>
