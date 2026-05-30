<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client';
  import Icon from '$lib/ui/Icon.svelte';
  import Card from '$lib/ui/Card.svelte';

  let dependencias = $state<any[]>([]);
  let macroprocesos = $state<any[]>([]);
  let procesos = $state<any[]>([]);
  let subprocesos = $state<any[]>([]);
  let loading = $state(true);
  let search = $state('');
  let selectedNivel = $state<string | null>(null);

  const niveles = ['ESTRATEGICO', 'MISIONAL', 'APOYO', 'EVALUACION'] as const;

  onMount(async () => {
    try {
      const [dep, mp, p, sp] = await Promise.all([
        api.dependencias.list(),
        api.macroprocesos.list(),
        api.procesos.list(),
        api.subprocesos.list ? api.subprocesos.list() : Promise.resolve([]),
      ]);
      dependencias = dep;
      macroprocesos = mp;
      procesos = p;
      subprocesos = sp;
    } catch (e: any) {
      console.error(e);
    } finally {
      loading = false;
    }
  });

  const depMap = $derived(
    Object.fromEntries(dependencias.map(d => [d.id, d]))
  );

  const filteredProcesos = $derived(
    procesos.filter(p => {
      if (search) {
        const q = search.toLowerCase();
        const macro = macroprocesos.find(m => m.id === p.macroprocesoId);
        return p.nombre.toLowerCase().includes(q) ||
               (macro?.nombre || '').toLowerCase().includes(q);
      }
      return true;
    })
  );

  const groupedByNivel = $derived(
    niveles.map(n => {
      const procs = filteredProcesos.filter(p => p.nivel === n);
      const macrosInNivel = new Map<string, any[]>();
      for (const p of procs) {
        const macro = macroprocesos.find(m => m.id === p.macroprocesoId);
        const macroName = macro?.nombre || 'Sin macroproceso';
        if (!macrosInNivel.has(macroName)) macrosInNivel.set(macroName, []);
        macrosInNivel.get(macroName)!.push(p);
      }
      return { nivel: n, macroprocesos: [...macrosInNivel.entries()].map(([nombre, procs]) => ({ nombre, procs })) };
    })
  );

  const nivelColors: Record<string, { border: string; header: string; text: string; bg: string; light: string }> = {
    ESTRATEGICO: { border: 'border-blue-200', header: 'bg-blue-600', text: 'text-blue-700', bg: 'bg-blue-50', light: 'bg-blue-100' },
    MISIONAL: { border: 'border-emerald-200', header: 'bg-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50', light: 'bg-emerald-100' },
    APOYO: { border: 'border-amber-200', header: 'bg-amber-600', text: 'text-amber-700', bg: 'bg-amber-50', light: 'bg-amber-100' },
    EVALUACION: { border: 'border-purple-200', header: 'bg-purple-600', text: 'text-purple-700', bg: 'bg-purple-50', light: 'bg-purple-100' },
  };

  const nivelLabel: Record<string, string> = {
    ESTRATEGICO: 'Estratégico', MISIONAL: 'Misional', APOYO: 'Apoyo', EVALUACION: 'Evaluación',
  };

  function getDependencias(macroId: string): string[] {
    const macros = macroprocesos.filter(m => m.id === macroId);
    return [...new Set(macros.map(m => depMap[m.dependenciaId]?.nombre).filter(Boolean))];
  }

  function getMacroDependencias(macroName: string): string[] {
    const macroIds = [...new Set(procesos.filter(p => {
      const m = macroprocesos.find(mp => mp.id === p.macroprocesoId);
      return m?.nombre === macroName;
    }).map(p => p.macroprocesoId))];
    const deps = macroIds.flatMap(mid => {
      const ms = macroprocesos.filter(m => m.id === mid);
      return ms.map(m => depMap[m.dependenciaId]?.nombre).filter(Boolean);
    });
    return [...new Set(deps)];
  }
</script>

<div class="max-w-7xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Matriz de Procesos</h1>
      <p class="text-sm text-gray-500 mt-1">Macroprocesos, procesos y dependencias responsables</p>
    </div>
    <div class="relative">
      <Icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input bind:value={search} placeholder="Buscar proceso..." class="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64" />
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="flex gap-2 flex-wrap">
      <button onclick={() => selectedNivel = null} class="px-3 py-1.5 text-xs font-medium rounded-full transition cursor-pointer {!selectedNivel ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">Todos</button>
      {#each niveles as n}
        <button onclick={() => selectedNivel = n} class="px-3 py-1.5 text-xs font-medium rounded-full transition cursor-pointer {selectedNivel === n ? nivelColors[n].header + ' text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">{nivelLabel[n]}</button>
      {/each}
    </div>

    {#each groupedByNivel as group}
      {#if !selectedNivel || selectedNivel === group.nivel}
        {#each group.macroprocesos as macro}
          <Card title={macro.nombre} icon="clipboard-check">
            <div class="space-y-1">
              <div class="text-xs text-gray-400 mb-2">
                Dependencia(s): {getMacroDependencias(macro.nombre).join(', ') || 'Sin asignar'}
              </div>
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-xs text-gray-500 uppercase">
                    <th class="pb-2 font-medium">Proceso</th>
                    <th class="pb-2 font-medium hidden md:table-cell">Código</th>
                    <th class="pb-2 font-medium hidden lg:table-cell">Subprocesos</th>
                  </tr>
                </thead>
                <tbody>
                  {#each macro.procs as p}
                    <tr class="border-t border-gray-100">
                      <td class="py-2 text-gray-900 font-medium">{p.nombre}</td>
                      <td class="py-2 text-gray-400 hidden md:table-cell">{p.codigo || '—'}</td>
                      <td class="py-2 hidden lg:table-cell">
                        <div class="flex flex-wrap gap-1">
                          {#each subprocesos.filter(s => s.procesoId === p.id) as sp}
                            <span class="inline-flex px-2 py-0.5 text-xs rounded-full bg-gray-50 text-gray-600 border border-gray-200">{sp.nombre}</span>
                          {:else}
                            <span class="text-xs text-gray-400">—</span>
                          {/each}
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </Card>
        {:else}
          {#if !selectedNivel}
            <div class="text-center py-8 text-gray-500 italic">
              No hay macroprocesos en nivel {nivelLabel[group.nivel]}
            </div>
          {/if}
        {/each}
      {/if}
    {/each}

    {#if filteredProcesos.length === 0 && search}
      <div class="text-center py-16">
        <Icon name="search" class="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p class="text-gray-500 font-medium">Sin resultados para "{search}"</p>
        <button onclick={() => search = ''} class="text-sm text-blue-600 hover:text-blue-800 mt-1 cursor-pointer">Limpiar búsqueda</button>
      </div>
    {/if}

    <Card title="Resumen de Procesos" icon="bar-chart-3">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#each niveles as n}
          {@const count = procesos.filter(p => p.nivel === n).length}
          {@const macros = [...new Set(procesos.filter(p => p.nivel === n).map(p => {
            const m = macroprocesos.find(mp => mp.id === p.macroprocesoId);
            return m?.nombre;
          }).filter(Boolean))].length}
          <div class="text-center p-3 rounded-lg {nivelColors[n].bg}">
            <p class="text-2xl font-bold {nivelColors[n].text}">{count}</p>
            <p class="text-xs {nivelColors[n].text} opacity-80 mt-0.5">{macros} macro • {nivelLabel[n]}</p>
          </div>
        {/each}
      </div>
    </Card>
  {/if}
</div>
