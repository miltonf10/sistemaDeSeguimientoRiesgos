<script lang="ts">
  import { api } from '$lib/api/client';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Icon from '$lib/ui/Icon.svelte';
  import Card from '$lib/ui/Card.svelte';

	let step = $state(1);
	let loading = $state(false);
	let saving = $state(false);
	let createdRiesgoId = $state<string | null>(null);
	let createdEvaluacionId = $state<string | null>(null);

	let procesos = $state<any[]>([]);
	let activos = $state<any[]>([]);
	let dependencias = $state<any[]>([]);
	let usuarios = $state<any[]>([]);
	let evaluaciones = $state<any[]>([]);

	let form = $state({
		procesoId: '',
		activoId: '',
		nombre: '',
		causa: '',
		consecuencia: '',
		clasificacion: '',
		tipoRiesgo: 'Interno',
		probabilidad: 1,
		impacto: 1,
		observaciones: '',
	});

	let controles = $state<any[]>([]);
	let currentControl = $state({
		nombre: '',
		descripcion: '',
		tipoControl: 'PREVENTIVO',
		frecuencia: '',
		eficacia: 50,
		responsableId: '',
	});

	let riesgoCreado = $state<any>(null);
	let evaluacionCreada = $state<any>(null);

	const riesgoInherente = $derived(form.probabilidad * form.impacto);
	const nivelRiesgo = $derived(
		riesgoInherente >= 15 ? 'Alto' : riesgoInherente >= 8 ? 'Medio' : 'Bajo'
	);
	const nivelColor = $derived(
		nivelRiesgo === 'Alto' ? 'red' : nivelRiesgo === 'Medio' ? 'yellow' : 'green'
	);

	onMount(async () => {
		loading = true;
		try {
			const [p, a, d, u, e] = await Promise.all([
				api.procesos.list(),
				api.activos.list(),
				api.dependencias.list(),
				api.usuarios.list(),
				api.evaluaciones.list ? api.evaluaciones.list() : Promise.resolve([]),
			]);
			procesos = p;
			activos = a;
			dependencias = d;
			usuarios = u;
			evaluaciones = e;
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});

	async function guardarRiesgo() {
		saving = true;
		try {
			const riesgo = await api.riesgos.create({
				nombre: form.nombre,
				causa: form.causa,
				consecuencia: form.consecuencia,
				clasificacion: form.clasificacion,
				tipoRiesgo: form.tipoRiesgo,
				procesoId: form.procesoId,
				activoId: form.activoId,
			});
			riesgoCreado = riesgo;
			createdRiesgoId = riesgo.id;

			const evaluacion = await api.evaluaciones.create({
				riesgoId: riesgo.id,
				probabilidad: form.probabilidad,
				impacto: form.impacto,
				riesgoInherente: riesgoInherente,
				observaciones: form.observaciones,
			});
			evaluacionCreada = evaluacion;
			createdEvaluacionId = evaluacion.id;
		} catch (e: any) {
			alert('Error al guardar: ' + e.message);
		} finally {
			saving = false;
		}
	}

	async function agregarControl() {
		if (!createdEvaluacionId) return;
		try {
			await api.controles.create({
				...currentControl,
				eficacia: Number(currentControl.eficacia),
				evaluacionId: createdEvaluacionId,
			});
			currentControl = { nombre: '', descripcion: '', tipoControl: 'PREVENTIVO', frecuencia: '', eficacia: 50, responsableId: '' };
			if (createdEvaluacionId) {
				controles = await api.controles.findByEvaluacion(createdEvaluacionId);
			}
		} catch (e: any) {
			alert('Error al guardar control: ' + e.message);
		}
	}

	async function cargarControles() {
		if (createdEvaluacionId) {
			controles = await api.controles.findByEvaluacion(createdEvaluacionId);
		}
	}

	$effect(() => {
		if (createdEvaluacionId) cargarControles();
	});

	const totalSteps = 5;
	const steps = [
		{ num: 1, label: 'Proceso y Activo' },
		{ num: 2, label: 'Datos del Riesgo' },
		{ num: 3, label: 'Valoración' },
		{ num: 4, label: 'Controles' },
		{ num: 5, label: 'Resultado' },
	];

	function canAdvance() {
		switch (step) {
			case 1: return form.procesoId && form.activoId;
			case 2: return form.nombre && form.causa && form.consecuencia && form.clasificacion;
			case 3: return true;
			case 4: return createdEvaluacionId !== null;
			default: return true;
		}
	}

	async function nextStep() {
		if (step === 3 && !createdRiesgoId) {
			await guardarRiesgo();
		}
		if (step < totalSteps) step++;
	}

	function prevStep() {
		if (step > 1) step--;
	}
</script>

<div class="max-w-4xl mx-auto space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Nuevo Riesgo</h1>
    <p class="text-gray-500 mt-1">Complete los pasos para registrar un nuevo riesgo institucional</p>
  </div>

  <div class="flex items-center gap-2 mb-2">
    {#each steps as s}
      <button onclick={() => step = s.num} class="flex items-center gap-2 cursor-pointer">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition"
          class:bg-blue-600={s.num === step}
          class:bg-blue-100={s.num < step}
          class:bg-gray-200={s.num > step}
          class:text-white={s.num <= step}
          class:text-gray-500={s.num > step}
        >
          {#if s.num < step}
            <Icon name="check" class="w-4 h-4" />
          {:else}
            {s.num}
          {/if}
        </div>
        <span class="text-sm hidden md:inline" class:text-blue-600={s.num === step} class:text-gray-500={s.num !== step}>
          {s.label}
        </span>
      </button>
      {#if s.num < totalSteps}
        <div class="flex-1 h-0.5 bg-gray-200">
          <div class="h-full bg-blue-600 transition-all" style="width: {s.num < step ? '100%' : '0%'}"></div>
        </div>
      {/if}
    {/each}
  </div>

  <Card>
		{#if step === 1}
			<div class="space-y-4">
				<h2 class="text-lg font-semibold text-gray-900">Seleccionar Proceso y Activo</h2>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Proceso</label>
					<select bind:value={form.procesoId} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
						<option value="">Seleccione un proceso...</option>
						{#each procesos as p}
							<option value={p.id}>{p.codigo} - {p.nombre}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Activo de Información</label>
					<select bind:value={form.activoId} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
						<option value="">Seleccione un activo...</option>
						{#each activos as a}
							<option value={a.id}>{a.nombre} ({a.clasificacion})</option>
						{/each}
					</select>
				</div>
			</div>

		{:else if step === 2}
			<div class="space-y-4">
				<h2 class="text-lg font-semibold text-gray-900">Datos del Riesgo</h2>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Riesgo</label>
					<input type="text" bind:value={form.nombre} placeholder="Ej: Pérdida de información contractual" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Causa</label>
					<textarea bind:value={form.causa} rows="3" placeholder="Describa la causa del riesgo" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Consecuencia</label>
					<textarea bind:value={form.consecuencia} rows="3" placeholder="Describa la consecuencia del riesgo" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Clasificación</label>
						<select bind:value={form.clasificacion} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
							<option value="">Seleccione...</option>
							<option value="Estratégico">Estratégico</option>
							<option value="Operativo">Operativo</option>
							<option value="Cumplimiento">Cumplimiento</option>
							<option value="Seguridad de la Información">Seguridad de la Información</option>
							<option value="Financiero">Financiero</option>
							<option value="Tecnológico">Tecnológico</option>
							<option value="Talento Humano">Talento Humano</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Riesgo</label>
						<select bind:value={form.tipoRiesgo} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
							<option value="Interno">Interno</option>
							<option value="Externo">Externo</option>
						</select>
					</div>
				</div>
			</div>

		{:else if step === 3}
			<div class="space-y-6">
				<h2 class="text-lg font-semibold text-gray-900">Valorar Probabilidad e Impacto</h2>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Probabilidad: {form.probabilidad}</label>
					<input type="range" min="1" max="5" bind:value={form.probabilidad} class="w-full accent-blue-600" />
					<div class="flex justify-between text-xs text-gray-500 mt-1">
						<span>1 - Muy Baja</span>
						<span>2 - Baja</span>
						<span>3 - Media</span>
						<span>4 - Alta</span>
						<span>5 - Muy Alta</span>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Impacto: {form.impacto}</label>
					<input type="range" min="1" max="5" bind:value={form.impacto} class="w-full accent-blue-600" />
					<div class="flex justify-between text-xs text-gray-500 mt-1">
						<span>1 - Muy Bajo</span>
						<span>2 - Bajo</span>
						<span>3 - Medio</span>
						<span>4 - Alto</span>
						<span>5 - Muy Alto</span>
					</div>
				</div>

				<div class="bg-gray-50 rounded-lg p-4">
					<p class="text-sm text-gray-600">Riesgo Inherente = Probabilidad × Impacto</p>
					<div class="mt-2 flex items-center gap-3">
						<span class="text-3xl font-bold" style="color: {nivelColor === 'red' ? '#dc2626' : nivelColor === 'yellow' ? '#d97706' : '#16a34a'}">
							{riesgoInherente}
						</span>
						<span class="px-3 py-1 rounded-full text-sm font-medium text-white" style="background-color: {nivelColor === 'red' ? '#dc2626' : nivelColor === 'yellow' ? '#d97706' : '#16a34a'}">
							{nivelRiesgo}
						</span>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
					<textarea bind:value={form.observaciones} rows="2" placeholder="Comentarios adicionales..." class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
				</div>
			</div>

		{:else if step === 4}
			<div class="space-y-6">
				<h2 class="text-lg font-semibold text-gray-900">Registrar Controles</h2>

				{#if controles.length > 0}
					<div class="space-y-2 mb-4">
						{#each controles as c}
							<div class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
								<div>
									<p class="font-medium text-gray-900">{c.nombre}</p>
									<p class="text-sm text-gray-500">{c.tipoControl} · Eficacia: {c.eficacia}%</p>
								</div>
								<span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{c.frecuencia}</span>
							</div>
						{/each}
					</div>
				{/if}

				<div class="border border-gray-200 rounded-lg p-4 space-y-3">
					<h3 class="font-medium text-gray-700">Nuevo Control</h3>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label class="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
							<input type="text" bind:value={currentControl.nombre} placeholder="Nombre del control" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
						</div>
						<div>
							<label class="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
							<select bind:value={currentControl.tipoControl} class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
								<option value="PREVENTIVO">Preventivo</option>
								<option value="DETECTIVO">Detectivo</option>
								<option value="CORRECTIVO">Correctivo</option>
							</select>
						</div>
						<div>
							<label class="block text-xs font-medium text-gray-600 mb-1">Frecuencia</label>
							<select bind:value={currentControl.frecuencia} class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
								<option value="">Seleccione...</option>
								<option value="Diario">Diario</option>
								<option value="Semanal">Semanal</option>
								<option value="Mensual">Mensual</option>
								<option value="Trimestral">Trimestral</option>
								<option value="Anual">Anual</option>
							</select>
						</div>
						<div>
							<label class="block text-xs font-medium text-gray-600 mb-1">Eficacia (%)</label>
							<input type="number" min="0" max="100" bind:value={currentControl.eficacia} class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
						</div>
					</div>
					<div>
						<label class="block text-xs font-medium text-gray-600 mb-1">Responsable</label>
						<select bind:value={currentControl.responsableId} class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
							<option value="">Seleccione...</option>
							{#each usuarios as u}
								<option value={u.id}>{u.nombre} - {u.rol}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
						<textarea bind:value={currentControl.descripcion} rows="2" placeholder="Descripción del control..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
					</div>
					<button onclick={agregarControl} disabled={!currentControl.nombre || saving} class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm rounded-lg transition cursor-pointer">
						Agregar Control
					</button>
				</div>
			</div>

		{:else if step === 5}
			<div class="space-y-6">
				<h2 class="text-lg font-semibold text-gray-900">Resultado del Riesgo</h2>

				{#if riesgoCreado && evaluacionCreada}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="bg-gray-50 rounded-lg p-4">
							<p class="text-sm text-gray-500">Riesgo Inherente</p>
							<p class="text-2xl font-bold" style="color: {nivelColor === 'red' ? '#dc2626' : nivelColor === 'yellow' ? '#d97706' : '#16a34a'}">
								{evaluacionCreada.riesgoInherente}
							</p>
							<span class="inline-block px-2 py-1 text-xs font-medium rounded-full text-white mt-1" style="background-color: {nivelColor === 'red' ? '#dc2626' : nivelColor === 'yellow' ? '#d97706' : '#16a34a'}">
								{nivelRiesgo}
							</span>
						</div>
						<div class="bg-gray-50 rounded-lg p-4">
							<p class="text-sm text-gray-500">Controles Registrados</p>
							<p class="text-2xl font-bold text-gray-900">{controles.length}</p>
							{#if controles.length > 0}
								<p class="text-sm text-gray-500 mt-1">Eficacia promedio: {Math.round(controles.reduce((a, c) => a + c.eficacia, 0) / controles.length)}%</p>
							{/if}
						</div>
					</div>

					<div class="bg-blue-50 rounded-lg p-4">
						<div class="flex items-center gap-2">
							<Icon name="check-circle" class="w-5 h-5 text-blue-600" />
							<p class="text-sm text-blue-800">
								Riesgo registrado exitosamente. Puede agregar más controles o generar un reporte.
							</p>
						</div>
					</div>

					<div class="flex gap-3">
						<a href="/riesgos/{riesgoCreado.id}" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
							Ver Detalle del Riesgo
						</a>
						<button onclick={() => goto('/riesgos')} class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm cursor-pointer">
							Volver a Riesgos
						</button>
					</div>
				{:else}
					<p class="text-gray-500">Guardando información...</p>
				{/if}
			</div>
		{/if}
	</Card>

	<div class="flex justify-between">
		<button onclick={prevStep} disabled={step === 1} class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition cursor-pointer">
			Anterior
		</button>
		{#if step < totalSteps}
			<button onclick={nextStep} disabled={!canAdvance() || saving} class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition cursor-pointer">
				{saving ? 'Guardando...' : 'Siguiente'}
			</button>
		{/if}
	</div>
</div>
