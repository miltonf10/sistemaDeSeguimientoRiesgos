<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { navStore } from '$lib/stores/nav.svelte';
  import { api, initTokens } from '$lib/api/client';
  import Icon from '$lib/ui/Icon.svelte';

  let step = $state(1);
  let saving = $state(false);
  let success = $state(false);
  let error = $state('');

  let dependencias = $state<any[]>([]);
  let macroprocesos = $state<any[]>([]);
  let procesos = $state<any[]>([]);
  let subprocesos = $state<any[]>([]);
  let activos = $state<any[]>([]);
  let currentUser = $state<any>(null);

  let form = $state({
    dependenciaId: '',
    macroprocesoId: '',
    procesoId: '',
    subprocesoId: '',
    tipo: '',
    nombre: '',
    descripcion: '',
    codigoGestionDocumental: '',
    serieDocumental: '',
    subserieDocumental: '',
    propietarioCargo: '',
    fechaGeneracion: '',
    custodioCargo: '',
    fechaIngresoArchivo: '',
    fechaIngresoNa: false,
    soporteRegistro: '',
    medioConservacion: '',
    formato: '',
    idioma: 'Español',
  });

  const tipos = [
    'Hardware', 'Software', 'Base de Datos', 'Documento', 'Aplicación',
    'Servicio Tecnológico', 'Infraestructura Tecnológica', 'Equipo de Comunicaciones',
    'Información Física', 'Información Digital', 'Medio Magnético', 'Repositorio Digital',
  ];

  const soportes = ['Físico', 'Digital', 'Híbrido'];

  const medios = [
    'Físico', 'Digital', 'Nube', 'Servidor Institucional',
    'Archivo de Gestión', 'Archivo Central',
  ];

  const formatos = [
    'PDF', 'Excel', 'Word', 'Imagen', 'Audio', 'Video',
    'Base de Datos', 'Aplicación', 'Carpeta Física', 'Otro',
  ];

  const idiomas = ['Español', 'Inglés', 'Portugués', 'Otro'];

  const steps = [
    { num: 1, label: 'Identificación' },
    { num: 2, label: 'Clasificación' },
    { num: 3, label: 'Clasificada / Reservada' },
    { num: 4, label: 'Datos Personales' },
  ];

  const identificador = $derived.by(() => {
    const year = new Date().getFullYear();
    const existing = activos.filter(a =>
      a.identificador?.startsWith(`ACT-${year}-`)
    );
    const maxNum = Math.max(
      0,
      ...existing.map(a => {
        const m = a.identificador?.match(/(\d+)$/);
        return m ? parseInt(m[1]) : 0;
      }),
    );
    return `ACT-${year}-${String(maxNum + 1).padStart(4, '0')}`;
  });

  const filteredMacros = $derived(
    form.dependenciaId
      ? macroprocesos.filter((m: any) => m.dependenciaId === form.dependenciaId)
      : []
  );

  const filteredProcesos = $derived(
    form.macroprocesoId
      ? procesos.filter((p: any) => p.macroprocesoId === form.macroprocesoId)
      : []
  );

  const requiredErrors = $derived.by(() => {
    const errs: string[] = [];
    if (!form.dependenciaId) errs.push('Dependencia');
    if (!form.macroprocesoId) errs.push('Macroproceso');
    if (!form.procesoId) errs.push('Proceso');
    if (!form.tipo) errs.push('Tipo de Activo');
    if (!form.nombre?.trim()) errs.push('Nombre del Activo');
    if (!form.descripcion?.trim()) errs.push('Descripción');
    if (!form.propietarioCargo?.trim()) errs.push('Cargo del Propietario');
    if (!form.fechaGeneracion) errs.push('Fecha de Generación');
    if (!form.custodioCargo?.trim()) errs.push('Cargo del Custodio');
    if (!form.soporteRegistro) errs.push('Soporte de Registro');
    if (!form.medioConservacion) errs.push('Medio de Conservación');
    if (!form.formato) errs.push('Formato');
    return errs;
  });

  const canSave = $derived(requiredErrors.length === 0);

  const pageIcon = $derived.by(() => {
    const fullPath = '/' + [$page.params.module, 'activos'].filter(Boolean).join('/');
    const item = navStore.activeModule?.nav?.find(i => fullPath === i.route);
    return item?.icon || 'server';
  });

  async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try { return await fn(); }
    catch (e) { console.warn('Fetch falló:', e); return fallback; }
  }

  function onDependenciaChange() {
    form.macroprocesoId = '';
    form.procesoId = '';
    form.subprocesoId = '';
    subprocesos = [];
  }

  function onMacroprocesoChange() {
    form.procesoId = '';
    form.subprocesoId = '';
    subprocesos = [];
  }

  async function onProcesoChange() {
    form.subprocesoId = '';
    if (form.procesoId) {
      subprocesos = await safeFetch(() => api.subprocesos.findByProceso(form.procesoId), []);
    } else {
      subprocesos = [];
    }
  }

  async function handleSubmit() {
    if (!canSave) return;
    saving = true;
    error = '';
    try {
      if (!currentUser?.id) {
        throw new Error('No se pudo identificar al usuario. Recarga la página o inicia sesión de nuevo.');
      }
      const payload: Record<string, any> = {
        identificador,
        nombre: form.nombre.trim(),
        tipo: form.tipo,
        descripcion: form.descripcion.trim(),
        dependenciaId: form.dependenciaId,
        macroprocesoId: form.macroprocesoId,
        procesoId: form.procesoId,
        responsableId: currentUser.id,
        propietarioCargo: form.propietarioCargo.trim(),
        fechaGeneracion: form.fechaGeneracion ? `${form.fechaGeneracion}T00:00:00.000Z` : undefined,
        custodioCargo: form.custodioCargo.trim(),
        soporteRegistro: form.soporteRegistro,
        medioConservacion: form.medioConservacion,
        formato: form.formato,
        idioma: form.idioma,
      };
      if (form.subprocesoId) payload.subprocesoId = form.subprocesoId;
      if (form.codigoGestionDocumental) payload.codigoGestionDocumental = form.codigoGestionDocumental;
      if (form.serieDocumental) payload.serieDocumental = form.serieDocumental;
      if (form.subserieDocumental) payload.subserieDocumental = form.subserieDocumental;
      if (!form.fechaIngresoNa && form.fechaIngresoArchivo) {
        payload.fechaIngresoArchivo = `${form.fechaIngresoArchivo}T00:00:00.000Z`;
      }
      console.log('[Activos] Payload enviado:', JSON.stringify(payload, null, 2));
      await api.activos.create(payload);
      success = true;
    } catch (e: any) {
      console.error('[Activos] Error al crear:', e);
      error = e.message;
    } finally {
      saving = false;
    }
  }

  function inputClass(hasError: boolean) {
    return `w-full px-3 py-2 text-sm text-gray-900 border rounded-lg outline-none transition ${
      hasError
        ? 'border-red-400 ring-2 ring-red-100'
        : 'border-gray-300 focus:ring-2 focus:border-gray-400 focus:ring-gray-100'
    }`;
  }

  function selectClass(hasError: boolean) {
    return inputClass(hasError) + ' appearance-none';
  }

  onMount(async () => {
    initTokens();
    const [user, deps, macros, procs, acts] = await Promise.all([
      safeFetch<{ id: string } | null>(() => api.auth.profile(), null),
      safeFetch(() => api.dependencias.list(), []),
      safeFetch(() => api.macroprocesos.list(), []),
      safeFetch(() => api.procesos.list(), []),
      safeFetch(() => api.activos.list(), []),
    ]);
    currentUser = user;
    dependencias = deps;
    macroprocesos = macros;
    procesos = procs;
    activos = acts;
  });
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center gap-3">
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center"
      style="background-color: color-mix(in srgb, var(--color-module-primary) 8%, transparent);"
    >
      <Icon name={pageIcon} class="w-5 h-5" style="color: var(--color-module-primary);" />
    </div>
    <div>
      <h1 class="text-xl font-bold text-gray-900">Nuevo Activo de Información</h1>
      <p class="text-sm text-gray-500">{navStore.activeModule?.description || ''}</p>
    </div>
  </div>

  {#if success}
    <!-- Success state -->
    <div class="bg-white rounded-xl border border-gray-200/80 shadow-sm p-12 text-center">
      <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <Icon name="check" class="w-8 h-8 text-green-600" />
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-1">Activo registrado exitosamente</h2>
      <p class="text-sm text-gray-500 mb-2 font-mono">{identificador}</p>
      <p class="text-sm text-gray-500 mb-6">{form.nombre}</p>
      <div class="flex items-center justify-center gap-3">
        <a
          href="/{$page.params.module}/activos"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          <Icon name="arrow-left" class="w-4 h-4" />
          Volver a Activos
        </a>
        <button
          onclick={() => { success = false; form = { dependenciaId: '', macroprocesoId: '', procesoId: '', subprocesoId: '', tipo: '', nombre: '', descripcion: '', codigoGestionDocumental: '', serieDocumental: '', subserieDocumental: '', propietarioCargo: '', fechaGeneracion: '', custodioCargo: '', fechaIngresoArchivo: '', fechaIngresoNa: false, soporteRegistro: '', medioConservacion: '', formato: '', idioma: 'Español' }; }}
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg transition"
          style="background-color: var(--color-module-primary);"
        >
          <Icon name="plus" class="w-4 h-4" />
          Registrar otro
        </button>
      </div>
    </div>
  {:else}
    <!-- Wizard Steps -->
    <div class="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
      <div class="flex items-center gap-0">
        {#each steps as s, i}
          <div class="flex items-center flex-1">
            <div class="flex items-center gap-2">
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0"
                class:text-white={step >= s.num}
                class:text-gray-400={step < s.num}
                style={step >= s.num ? `background-color: var(--color-module-primary);` : ''}
                class:bg-gray-200={step < s.num}
              >
                {s.num}
              </div>
              <span
                class="text-xs font-medium hidden sm:inline"
                style={step === s.num ? `color: var(--color-module-primary);` : ''}
                class:text-gray-900={step > s.num}
                class:text-gray-400={step < s.num}
              >
                {s.label}
              </span>
            </div>
            {#if i < steps.length - 1}
              <div
                class="flex-1 h-px mx-2"
                class:bg-gray-200={step <= s.num}
                style={step > s.num ? `background-color: var(--color-module-primary);` : ''}
              ></div>
            {/if}
          </div>
        {/each}
      </div>

      {#if error}
        <div class="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          <Icon name="alert-circle" class="w-4 h-4 inline-block align-text-bottom mr-1" />
          {error}
        </div>
      {/if}
    </div>

    <!-- Phase 1: Identificación del Activo -->
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">

      <!-- 1. Ubicación Organizacional -->
      <fieldset class="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 space-y-5">
        <legend class="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Icon name="map-pin" class="w-4 h-4" style="color: var(--color-module-primary);" />
          Ubicación Organizacional
        </legend>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Dependencia <span class="text-red-500">*</span>
            </label>
            <select
              class={selectClass(false)}
              bind:value={form.dependenciaId}
              onchange={onDependenciaChange}
            >
              <option value="">Seleccione una dependencia</option>
              {#each dependencias as d}
                <option value={d.id}>{d.nombre}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Macroproceso <span class="text-red-500">*</span>
            </label>
            <select
              class={selectClass(false)}
              bind:value={form.macroprocesoId}
              disabled={!form.dependenciaId}
              onchange={onMacroprocesoChange}
            >
              <option value="">Seleccione un macroproceso</option>
              {#each filteredMacros as m}
                <option value={m.id}>{m.nombre}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Proceso <span class="text-red-500">*</span>
            </label>
            <select
              class={selectClass(false)}
              bind:value={form.procesoId}
              disabled={!form.macroprocesoId}
              onchange={onProcesoChange}
            >
              <option value="">Seleccione un proceso</option>
              {#each filteredProcesos as p}
                <option value={p.id}>{p.nombre}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-500">
              Subproceso <span class="text-xs text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              class={selectClass(false)}
              bind:value={form.subprocesoId}
              disabled={!form.procesoId || subprocesos.length === 0}
            >
              <option value="">{subprocesos.length === 0 && form.procesoId ? 'Sin subprocesos' : 'Seleccione un subproceso'}</option>
              {#each subprocesos as s}
                <option value={s.id}>{s.nombre}</option>
              {/each}
            </select>
          </div>
        </div>
      </fieldset>

      <!-- 2. Identificación del Activo -->
      <fieldset class="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 space-y-5">
        <legend class="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Icon name="tag" class="w-4 h-4" style="color: var(--color-module-primary);" />
          Identificación del Activo
        </legend>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Identificador <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={identificador}
              readonly
              class="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 font-mono cursor-not-allowed"
            />
            <p class="text-xs text-gray-400">Generado automáticamente</p>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Tipo de Activo <span class="text-red-500">*</span>
            </label>
            <select class={selectClass(!form.tipo)} bind:value={form.tipo}>
              <option value="">Seleccione un tipo</option>
              {#each tipos as t}
                <option value={t}>{t}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1 md:col-span-2">
            <label class="text-sm font-medium text-gray-700">
              Nombre del Activo <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              class={inputClass(!form.nombre?.trim())}
              placeholder="Ej: Memoria USB"
              bind:value={form.nombre}
            />
          </div>

          <div class="space-y-1 md:col-span-2">
            <label class="text-sm font-medium text-gray-700">
              Descripción <span class="text-red-500">*</span>
            </label>
            <textarea
              class={inputClass(!form.descripcion?.trim()) + ' min-h-[80px] resize-y'}
              placeholder="Ej: Contiene información de los contratistas de la entidad"
              bind:value={form.descripcion}
            ></textarea>
          </div>
        </div>
      </fieldset>

      <!-- 3. Gestión Documental -->
      <fieldset class="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 space-y-5">
        <legend class="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Icon name="folder" class="w-4 h-4" style="color: var(--color-module-primary);" />
          Gestión Documental
        </legend>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500">
            Código del Sistema de Gestión Documental <span class="text-xs text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            class={inputClass(false)}
            placeholder="Ej: SGD-TIC-001"
            bind:value={form.codigoGestionDocumental}
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-500">
              Serie Documental <span class="text-xs text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              class={inputClass(false)}
              placeholder="TRD"
              bind:value={form.serieDocumental}
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-500">
              Subserie Documental <span class="text-xs text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              class={inputClass(false)}
              placeholder="TRD"
              bind:value={form.subserieDocumental}
            />
          </div>
        </div>
      </fieldset>

      <!-- 4. Responsables -->
      <fieldset class="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 space-y-5">
        <legend class="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Icon name="users" class="w-4 h-4" style="color: var(--color-module-primary);" />
          Responsables
        </legend>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Cargo de Producción de la Información (Propietario) <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              class={inputClass(!form.propietarioCargo?.trim())}
              placeholder="Ej: Auxiliar Administrativo"
              bind:value={form.propietarioCargo}
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Fecha de Generación de la Información <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              class={inputClass(!form.fechaGeneracion)}
              bind:value={form.fechaGeneracion}
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Cargo del Custodio del Activo <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              class={inputClass(!form.custodioCargo?.trim())}
              placeholder="Ej: Jefe de Oficina"
              bind:value={form.custodioCargo}
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-500">
              Fecha de Ingreso al Archivo <span class="text-xs text-gray-400 font-normal">(opcional)</span>
            </label>
            <div class="flex items-center gap-3">
              <input
                type="date"
                class={inputClass(false) + ' flex-1'}
                bind:value={form.fechaIngresoArchivo}
                disabled={form.fechaIngresoNa}
              />
              <label class="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  class="rounded border-gray-300"
                  bind:checked={form.fechaIngresoNa}
                />
                N/A
              </label>
            </div>
          </div>
        </div>
      </fieldset>

      <!-- 5. Características del Activo -->
      <fieldset class="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 space-y-5">
        <legend class="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Icon name="sliders" class="w-4 h-4" style="color: var(--color-module-primary);" />
          Características del Activo
        </legend>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Soporte: radio group -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">
              Soporte de Registro <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              {#each soportes as s}
                <button
                  type="button"
                  onclick={() => form.soporteRegistro = s}
                  class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-gray-700 border rounded-lg cursor-pointer transition"
                  class:border-gray-300={form.soporteRegistro !== s}
                  style={form.soporteRegistro === s ? 'border-color: var(--color-module-primary); background-color: color-mix(in srgb, var(--color-module-primary) 6%, transparent);' : ''}
                >
                  {s}
                </button>
              {/each}
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Medio de Conservación <span class="text-red-500">*</span>
            </label>
            <select class={selectClass(!form.medioConservacion)} bind:value={form.medioConservacion}>
              <option value="">Seleccione un medio</option>
              {#each medios as m}
                <option value={m}>{m}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Formato <span class="text-red-500">*</span>
            </label>
            <select class={selectClass(!form.formato)} bind:value={form.formato}>
              <option value="">Seleccione un formato</option>
              {#each formatos as f}
                <option value={f}>{f}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">
              Idioma <span class="text-red-500">*</span>
            </label>
            <select class={selectClass(false)} bind:value={form.idioma}>
              {#each idiomas as i}
                <option value={i}>{i}</option>
              {/each}
            </select>
          </div>
        </div>
      </fieldset>

      <!-- Validation summary -->
      {#if requiredErrors.length > 0}
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p class="text-xs font-medium text-amber-800 mb-1.5 flex items-center gap-1">
            <Icon name="alert-triangle" class="w-3.5 h-3.5" />
            Campos obligatorios pendientes:
          </p>
          <div class="flex flex-wrap gap-1.5">
            {#each requiredErrors as field}
              <span class="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-md">{field}</span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <a
          href="/{$page.params.module}/activos"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <Icon name="x" class="w-4 h-4" />
          Cancelar
        </a>
        <button
          type="submit"
          disabled={!canSave || saving}
          class="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style="background-color: var(--color-module-primary);"
        >
          {#if saving}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Guardando...
          {:else}
            <Icon name="save" class="w-4 h-4" />
            Guardar y continuar
          {/if}
        </button>
      </div>
    </form>
  {/if}
</div>
