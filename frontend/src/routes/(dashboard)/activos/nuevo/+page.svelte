<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api/client';
	import Icon from '$lib/ui/Icon.svelte';

	let step = $state(1);
	let saving = $state(false);
	let error = $state('');
	let success = $state(false);

	let dependencias = $state<any[]>([]);
	let macroprocesos = $state<any[]>([]);
	let procesos = $state<any[]>([]);
	let subprocesos = $state<any[]>([]);
	let usuarios = $state<any[]>([]);

	let form = $state({
		identificador: '',
		nombre: '',
		tipo: 'Documento',
		subTipo: '',
		descripcion: '',
		dependenciaId: '',
		macroprocesoId: '',
		procesoId: '',
		subprocesoId: '',
		codigoGestionDocumental: '',
		serieDocumental: '',
		subserieDocumental: '',
		responsableId: '',
		propietarioCargo: '',
		custodioCargo: '',
		fechaGeneracion: '',
		fechaIngresoArchivo: '',
		soporteRegistro: '',
		medioConservacion: '',
		formato: '',
		idioma: 'Español',
		confidencialidad: '',
		valorC: 3,
		integridad: '',
		valorI: 3,
		disponibilidad: '',
		valorD: 3,
		informacionPublicada: true as boolean | null,
		lugarConsulta: '',
		objetoLegitimoExcepcion: '',
		fundamentoConstitucionalLegal: '',
		fundamentoJuridicoExcepcion: '',
		excepcionTotalParcial: '',
		fechaClasificacion: '',
		tiempoClasificacion: '',
		contieneDatosPersonales: null as boolean | null,
		contieneDatosMenores: false,
		tiposDatosPersonales: '',
		finalidadTratamiento: '',
		existeAutorizacionTratamiento: null as boolean | null,
	});

	const tipos = ['Documento', 'Software', 'Hardware', 'Información', 'Infraestructura'];
	const soportes = ['Físico', 'Electrónico', 'Físico/Electrónico', 'Digital', 'Digital / Electrónico'];
	const medios = ['Papel', 'Digital', 'Microfilmación', 'CD/DVD', 'Disco Duro', 'Cinta Magnética', 'Cloud'];
	const formatos = ['Digital', 'Físico', 'Físico/Electrónico', 'Archivos Institucionales - físicos'];
	const idiomas = ['Español', 'Inglés', 'Portugués', 'Francés'];
	const nivelesCIA = [
		{ v: 1, label: '1 - Baja' },
		{ v: 2, label: '2 - Media-Baja' },
		{ v: 3, label: '3 - Media' },
		{ v: 4, label: '4 - Alta' },
		{ v: 5, label: '5 - Muy Alta' },
	];

	let criticidad = $derived((() => {
		const vs = [form.valorC, form.valorI, form.valorD].filter(v => v != null) as number[];
		if (vs.length === 0) return 'Sin clasificar';
		const avg = vs.reduce((a, b) => a + b, 0) / vs.length;
		if (avg >= 4) return 'Alta';
		if (avg >= 2.5) return 'Media';
		return 'Baja';
	})());

	let confLabel = $derived(form.valorC ? (form.valorC <= 2 ? 'Baja' : form.valorC <= 3 ? 'Media' : 'Alta') : '');
	let intLabel = $derived(form.valorI ? (form.valorI <= 2 ? 'Baja' : form.valorI <= 3 ? 'Media' : 'Alta') : '');
	let dispLabel = $derived(form.valorD ? (form.valorD <= 2 ? 'Baja' : form.valorD <= 3 ? 'Media' : 'Alta') : '');

	let showClasificada = $derived(form.informacionPublicada === false);
	let showDatosPersonales = $derived(form.contieneDatosPersonales === true);
	let datosMenoresAlert = $derived(form.contieneDatosMenores && showDatosPersonales);

	onMount(async () => {
		try {
			[dependencias, macroprocesos, procesos, usuarios] = await Promise.all([
				api.dependencias.list(),
				api.macroprocesos.list(),
				api.procesos.list(),
				api.usuarios.list(),
			]);
		} catch (e: any) { error = e.message; }
	});

	let filteredMacros = $derived(
		form.dependenciaId
			? macroprocesos.filter((m: any) => m.dependenciaId === form.dependenciaId)
			: []
	);

	let filteredProcesos = $derived(
		form.macroprocesoId
			? procesos.filter((p: any) => p.macroprocesoId === form.macroprocesoId)
			: []
	);

	async function loadSubprocesos() {
		if (form.procesoId) {
			subprocesos = await api.subprocesos.findByProceso(form.procesoId);
		} else {
			subprocesos = [];
		}
	}

	function canProceed(s: number): boolean {
		if (s === 1) {
			if (!form.nombre || !form.tipo || !form.dependenciaId || !form.responsableId) return false;
			return true;
		}
		if (s === 2) return true;
		if (s === 3) return true;
		if (s === 4) return true;
		return false;
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
		await loadSubprocesos();
	}

	function next() { if (step < 4 && canProceed(step)) step++; }
	function prev() { if (step > 1) step--; }

	async function handleSubmit() {
		saving = true;
		error = '';
		try {
			const payload = {
				...form,
				confidencialidad: confLabel || undefined,
				integridad: intLabel || undefined,
				disponibilidad: dispLabel || undefined,
				criticidad,
				contieneDatosPersonales: form.contieneDatosPersonales ?? undefined,
				existeAutorizacionTratamiento: form.existeAutorizacionTratamiento ?? undefined,
				informacionPublicada: form.informacionPublicada ?? undefined,
			};
			await api.activos.create(payload);
			success = true;
		} catch (e: any) { error = e.message; }
		finally { saving = false; }
	}

	function stepClass(s: number) {
		if (step === s) return 'bg-blue-600 text-white ring-4 ring-blue-100';
		if (step > s) return 'bg-green-500 text-white';
		return 'bg-gray-200 text-gray-500';
	}
</script>

<div class="p-6 max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Registrar Activo de Información</h1>
		<p class="text-sm text-gray-500 mt-1">
			Complete los 4 pasos para registrar un nuevo activo conforme a la metodología institucional
		</p>
	</div>

	<div class="flex items-center gap-0 mb-8">
		{#each ['Identificación', 'Clasificación', 'Clasificada/Reservada', 'Datos Personales'] as label, i}
			<div class="flex items-center flex-1">
				<div class="flex items-center gap-2">
					<div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all {stepClass(i + 1)}">
						{i + 1}
					</div>
					<span class="text-xs font-medium hidden sm:inline" class:text-blue-700={step === i + 1} class:text-gray-400={step !== i + 1}>{label}</span>
				</div>
				{#if i < 3}<div class="flex-1 h-px mx-2" class:bg-blue-200={step > i + 1} class:bg-gray-200={step <= i + 1}></div>{/if}
			</div>
		{/each}
	</div>

	{#if success}
		<div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
			<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Icon name="check" class="w-8 h-8 text-green-600" />
			</div>
			<h2 class="text-xl font-semibold text-green-800 mb-2">Activo registrado exitosamente</h2>
			<p class="text-green-600 mb-6">El activo ha sido creado con todos los datos ingresados</p>
			<div class="flex justify-center gap-3">
				<a href="/activos/nuevo" onclick={() => { success = false; form = { ...form, nombre: '', identificador: '' } }} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">Registrar otro</a>
				<a href="/activos" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">Volver al listado</a>
			</div>
		</div>
	{:else}
		<form onsubmit={(e) => { e.preventDefault(); if (step < 4) next(); else handleSubmit(); }}>
			<!-- STEP 1: Identificación -->
			{#if step === 1}
				<div class="space-y-6">
					<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-2 mb-5">
							<div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
								<Icon name="file-text" class="w-4 h-4 text-blue-600" />
							</div>
							<div>
								<h2 class="text-lg font-semibold text-gray-900">Identificación del Activo</h2>
								<p class="text-xs text-gray-500">Ley 594 de 2000 · Ley 1712 de 2014 · Decreto 103/1080 de 2015 · ISO 27001</p>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="md:col-span-2">
								<label class="block text-sm font-medium text-gray-700 mb-1">Nombre del activo <span class="text-red-500">*</span></label>
								<input bind:value={form.nombre} required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Ej: Sistema de Gestión Documental" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Identificador</label>
								<input bind:value={form.identificador} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Ej: TIC-SGD-001" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Tipo <span class="text-red-500">*</span></label>
								<select bind:value={form.tipo} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									{#each tipos as t}<option value={t}>{t}</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Sub-tipo</label>
								<input bind:value={form.subTipo} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Ej: Plataforma Misional" />
							</div>
							<div class="md:col-span-2">
								<label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
								<textarea bind:value={form.descripcion} rows={2} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Descripción del activo..."></textarea>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Dependencia <span class="text-red-500">*</span></label>
								<select bind:value={form.dependenciaId} onchange={onDependenciaChange} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									<option value="">Seleccione...</option>
									{#each dependencias as d}<option value={d.id}>{d.nombre}</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Macroproceso</label>
								<select bind:value={form.macroprocesoId} onchange={onMacroprocesoChange} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									<option value="">Seleccione...</option>
									{#each filteredMacros as m}<option value={m.id}>{m.nombre}</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Proceso</label>
								<select bind:value={form.procesoId} onchange={onProcesoChange} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									<option value="">Seleccione...</option>
									{#each filteredProcesos as p}<option value={p.id}>{p.nombre} ({p.nivel})</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Subproceso</label>
								<select bind:value={form.subprocesoId} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									<option value="">Seleccione...</option>
									{#each subprocesos as s}<option value={s.id}>{s.nombre}</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Código Gestión Documental</label>
								<input bind:value={form.codigoGestionDocumental} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Código SGD" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Serie documental</label>
								<input bind:value={form.serieDocumental} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Subserie documental</label>
								<input bind:value={form.subserieDocumental} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
							</div>
						</div>
					</div>

					<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-2 mb-5">
							<div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
								<Icon name="users" class="w-4 h-4 text-purple-600" />
							</div>
							<h2 class="text-lg font-semibold text-gray-900">Responsables</h2>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Responsable del sistema <span class="text-red-500">*</span></label>
								<select bind:value={form.responsableId} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									<option value="">Seleccione...</option>
									{#each usuarios as u}<option value={u.id}>{u.nombre} — {u.cargo || ''}</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Propietario del activo <span class="text-xs text-gray-400">(cargo)</span></label>
								<input bind:value={form.propietarioCargo} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Cargo del productor de la información" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Custodio del activo <span class="text-xs text-gray-400">(cargo)</span></label>
								<input bind:value={form.custodioCargo} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Cargo del encargado de la información" />
							</div>
						</div>
					</div>

					<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center gap-2 mb-5">
							<div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
								<Icon name="clipboard-list" class="w-4 h-4 text-amber-600" />
							</div>
							<div>
								<h2 class="text-lg font-semibold text-gray-900">Características técnicas</h2>
								<p class="text-xs text-gray-500">Soporte, formato, medio de conservación e idioma</p>
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Soporte de registro</label>
								<select bind:value={form.soporteRegistro} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									<option value="">Seleccione...</option>
									{#each soportes as s}<option value={s}>{s}</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Medio de conservación</label>
								<select bind:value={form.medioConservacion} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									<option value="">Seleccione...</option>
									{#each medios as m}<option value={m}>{m}</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Formato</label>
								<select bind:value={form.formato} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									<option value="">Seleccione...</option>
									{#each formatos as f}<option value={f}>{f}</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
								<select bind:value={form.idioma} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
									{#each idiomas as i}<option value={i}>{i}</option>{/each}
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Fecha de generación</label>
								<input type="date" bind:value={form.fechaGeneracion} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Fecha ingreso al archivo</label>
								<input type="date" bind:value={form.fechaIngresoArchivo} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- STEP 2: Clasificación ISO 27001 -->
			{#if step === 2}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-2 mb-5">
						<div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
							<Icon name="shield-check" class="w-4 h-4 text-emerald-600" />
						</div>
						<div>
							<h2 class="text-lg font-semibold text-gray-900">Clasificación del Activo — ISO 27001</h2>
							<p class="text-xs text-gray-500">Evalúe la confidencialidad, integridad y disponibilidad del activo</p>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						<div class="border rounded-lg p-4">
							<label class="block text-sm font-medium text-gray-700 mb-2">Confidencialidad (C)</label>
							<select bind:value={form.valorC} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
								{#each nivelesCIA as n}<option value={n.v}>{n.label}</option>{/each}
							</select>
							<div class="mt-2 flex items-center gap-2">
								<span class="text-xs text-gray-500">Nivel:</span>
								<span class="text-xs font-semibold px-2 py-0.5 rounded" class:bg-red-100={confLabel === 'Alta'} class:text-red-700={confLabel === 'Alta'} class:bg-yellow-100={confLabel === 'Media'} class:text-yellow-700={confLabel === 'Media'} class:bg-green-100={confLabel === 'Baja'} class:text-green-700={confLabel === 'Baja'}>{confLabel || 'Sin evaluar'}</span>
							</div>
							<p class="text-xs text-gray-400 mt-1">¿Qué tan sensible es la información?</p>
						</div>
						<div class="border rounded-lg p-4">
							<label class="block text-sm font-medium text-gray-700 mb-2">Integridad (I)</label>
							<select bind:value={form.valorI} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
								{#each nivelesCIA as n}<option value={n.v}>{n.label}</option>{/each}
							</select>
							<div class="mt-2 flex items-center gap-2">
								<span class="text-xs text-gray-500">Nivel:</span>
								<span class="text-xs font-semibold px-2 py-0.5 rounded" class:bg-red-100={intLabel === 'Alta'} class:text-red-700={intLabel === 'Alta'} class:bg-yellow-100={intLabel === 'Media'} class:text-yellow-700={intLabel === 'Media'} class:bg-green-100={intLabel === 'Baja'} class:text-green-700={intLabel === 'Baja'}>{intLabel || 'Sin evaluar'}</span>
							</div>
							<p class="text-xs text-gray-400 mt-1">¿Debe ser precisa y completa?</p>
						</div>
						<div class="border rounded-lg p-4">
							<label class="block text-sm font-medium text-gray-700 mb-2">Disponibilidad (D)</label>
							<select bind:value={form.valorD} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
								{#each nivelesCIA as n}<option value={n.v}>{n.label}</option>{/each}
							</select>
							<div class="mt-2 flex items-center gap-2">
								<span class="text-xs text-gray-500">Nivel:</span>
								<span class="text-xs font-semibold px-2 py-0.5 rounded" class:bg-red-100={dispLabel === 'Alta'} class:text-red-700={dispLabel === 'Alta'} class:bg-yellow-100={dispLabel === 'Media'} class:text-yellow-700={dispLabel === 'Media'} class:bg-green-100={dispLabel === 'Baja'} class:text-green-700={dispLabel === 'Baja'}>{dispLabel || 'Sin evaluar'}</span>
							</div>
							<p class="text-xs text-gray-400 mt-1">¿Qué tan crítico es su acceso?</p>
						</div>
					</div>

					<div class="bg-gray-50 border border-gray-200 rounded-lg p-5">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-700">Criticidad del activo</p>
								<p class="text-xs text-gray-500 mt-0.5">Calculada automáticamente del promedio C+I+D</p>
							</div>
							<div class="flex items-center gap-3">
								<div class="text-right">
									<span class="text-xs text-gray-400">C={form.valorC} · I={form.valorI} · D={form.valorD}</span>
									<p class="text-lg font-bold {criticidad === 'Alta' ? 'text-red-600' : criticidad === 'Media' ? 'text-yellow-600' : criticidad === 'Baja' ? 'text-green-600' : 'text-gray-400'}">{criticidad}</p>
								</div>
								<div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white" class:bg-red-500={criticidad === 'Alta'} class:bg-yellow-500={criticidad === 'Media'} class:bg-green-500={criticidad === 'Baja'} class:bg-gray-300={criticidad === 'Sin clasificar'}>
									{criticidad === 'Alta' ? 'A' : criticidad === 'Media' ? 'M' : criticidad === 'Baja' ? 'B' : '-'}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- STEP 3: Información Clasificada y Reservada -->
			{#if step === 3}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-2 mb-5">
						<div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
							<Icon name="shield" class="w-4 h-4 text-red-600" />
						</div>
						<div>
							<h2 class="text-lg font-semibold text-gray-900">Índice de Información Clasificada y Reservada</h2>
							<p class="text-xs text-gray-500">Decreto 103 de 2015 — Gestión de excepciones legales</p>
						</div>
					</div>

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">¿La información es pública o reservada?</label>
							<div class="flex gap-4">
								<label class="flex items-center gap-2 cursor-pointer">
									<input type="radio" bind:group={form.informacionPublicada} value={true} class="accent-blue-600" />
									<span class="text-sm text-gray-700">Información pública</span>
								</label>
								<label class="flex items-center gap-2 cursor-pointer">
									<input type="radio" bind:group={form.informacionPublicada} value={false} class="accent-blue-600" />
									<span class="text-sm text-gray-700">Información reservada / clasificada</span>
								</label>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Lugar de consulta / ubicación</label>
							<input bind:value={form.lugarConsulta} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="URL, ubicación física o repositorio" />
						</div>

						{#if showClasificada}
							<div class="border border-red-200 bg-red-50 rounded-lg p-4 space-y-4">
								<p class="text-xs font-medium text-red-700">Información clasificada / reservada — complete los fundamentos legales</p>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">Objeto legítimo de la excepción</label>
										<input bind:value={form.objetoLegitimoExcepcion} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">Fundamento constitucional o legal</label>
										<input bind:value={form.fundamentoConstitucionalLegal} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ej: Art. 15 CP, Ley 1712 de 2014" />
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">Fundamento jurídico de la excepción</label>
										<input bind:value={form.fundamentoJuridicoExcepcion} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">Excepción total o parcial</label>
										<select bind:value={form.excepcionTotalParcial} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
											<option value="">Seleccione...</option>
											<option value="Total">Total</option>
											<option value="Parcial">Parcial</option>
										</select>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">Fecha de clasificación</label>
										<input type="date" bind:value={form.fechaClasificacion} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">Tiempo de clasificación</label>
										<input bind:value={form.tiempoClasificacion} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ej: 10 años, Indefinido" />
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- STEP 4: Datos Personales -->
			{#if step === 4}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-2 mb-5">
						<div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
							<Icon name="users" class="w-4 h-4 text-indigo-600" />
						</div>
						<div>
							<h2 class="text-lg font-semibold text-gray-900">Protección de Datos Personales</h2>
							<p class="text-xs text-gray-500">Ley 1581 de 2012 — Registro Nacional de Bases de Datos</p>
						</div>
					</div>

					<div class="space-y-5">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">¿Contiene datos personales?</label>
							<div class="flex gap-4">
								<label class="flex items-center gap-2 cursor-pointer">
									<input type="radio" bind:group={form.contieneDatosPersonales} value={true} class="accent-blue-600" />
									<span class="text-sm text-gray-700">Sí</span>
								</label>
								<label class="flex items-center gap-2 cursor-pointer">
									<input type="radio" bind:group={form.contieneDatosPersonales} value={false} class="accent-blue-600" />
									<span class="text-sm text-gray-700">No</span>
								</label>
							</div>
						</div>

						{#if datosMenoresAlert}
							<div class="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
								<Icon name="triangle-alert" class="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
								<div>
									<p class="text-sm font-medium text-red-800">Alerta: Datos de niños, niñas o adolescentes</p>
									<p class="text-xs text-red-600 mt-1">Este activo contiene datos de menores de edad. Se requiere autorización expresa de los padres y se incrementa la criticidad del activo.</p>
								</div>
							</div>
						{/if}

						{#if showDatosPersonales}
							<div class="border border-indigo-200 bg-indigo-50 rounded-lg p-4 space-y-4">
								<p class="text-xs font-medium text-indigo-700">Complete la información de protección de datos</p>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label class="flex items-center gap-2 cursor-pointer">
											<input type="checkbox" bind:checked={form.contieneDatosMenores} class="accent-indigo-600 rounded" />
											<span class="text-sm text-gray-700">Contiene datos de niños, niñas o adolescentes</span>
										</label>
									</div>
									<div></div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">Tipos de datos personales</label>
										<input bind:value={form.tiposDatosPersonales} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ej: Identificación, contacto, biométricos" />
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-1">Finalidad del tratamiento</label>
										<input bind:value={form.finalidadTratamiento} class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ej: Gestión de nómina, prestación de servicios" />
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">¿Existe autorización para el tratamiento?</label>
										<div class="flex gap-4">
											<label class="flex items-center gap-2 cursor-pointer">
												<input type="radio" bind:group={form.existeAutorizacionTratamiento} value={true} class="accent-blue-600" />
												<span class="text-sm text-gray-700">Sí</span>
											</label>
											<label class="flex items-center gap-2 cursor-pointer">
												<input type="radio" bind:group={form.existeAutorizacionTratamiento} value={false} class="accent-blue-600" />
												<span class="text-sm text-gray-700">No</span>
											</label>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			{#if error}
				<div class="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
			{/if}

			<div class="mt-6 flex items-center justify-between">
				<div>
					{#if step > 1}
						<button type="button" onclick={prev} class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer font-medium">
							← Anterior
						</button>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					<span class="text-xs text-gray-400">Paso {step}/4</span>
					<button type="submit" disabled={saving || !canProceed(step)} class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium">
						{#if saving}
							<span class="flex items-center gap-2"><span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Guardando...</span>
						{:else if step < 4}
							Siguiente →
						{:else}
							Guardar Activo
						{/if}
					</button>
				</div>
			</div>
		</form>
	{/if}
</div>
