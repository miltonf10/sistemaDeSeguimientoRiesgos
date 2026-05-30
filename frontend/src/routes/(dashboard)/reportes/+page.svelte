<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client';
  import Card from '$lib/ui/Card.svelte';
  import Icon from '$lib/ui/Icon.svelte';

  let riesgosPorProceso = $state<any[]>([]);
  let riesgosPorDependencia = $state<any[]>([]);
  let riesgosAltos = $state<any[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const [rpp, rpd, ra] = await Promise.all([
        api.reportes.riesgosPorProceso(),
        api.reportes.riesgosPorDependencia(),
        api.reportes.riesgosAltos(),
      ]);
      riesgosPorProceso = rpp;
      riesgosPorDependencia = rpd;
      riesgosAltos = ra;
    } catch {
      riesgosPorProceso = [];
      riesgosPorDependencia = [];
      riesgosAltos = [];
    } finally {
      loading = false;
    }
  });

  const riskStyles: Record<string, string> = {
    ALTO: 'bg-red-50 text-red-700 border-red-200',
    CRITICO: 'bg-red-50 text-red-700 border-red-200',
    'MUY ALTO': 'bg-red-50 text-red-700 border-red-200',
    MEDIO: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    BAJO: 'bg-green-50 text-green-700 border-green-200',
  };

  function nivelBadge(n: string) {
    const s = riskStyles[n] || 'bg-gray-50 text-gray-600 border-gray-200';
    return `<span class="inline-flex items-center gap-1 font-medium rounded-full border text-xs px-2 py-0.5 ${s}">${n}</span>`;
  }
</script>

<div class="max-w-7xl mx-auto space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Reportes</h1>
    <p class="text-sm text-gray-500 mt-1">Resumen y análisis de riesgos</p>
  </div>

  {#if loading}
    <div class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Riesgos por Proceso" icon="bar-chart-3">
        {#if riesgosPorProceso.length > 0}
          <ul class="space-y-2">
            {#each riesgosPorProceso as item}
              <li class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span class="text-sm text-gray-700">{item.proceso?.nombre || item.nombre || 'Sin proceso'}</span>
                <span class="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-primary rounded-full">{item.total || item.count || 0}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-sm text-gray-500 italic text-center py-6">Sin datos disponibles</p>
        {/if}
      </Card>

      <Card title="Riesgos por Dependencia" icon="users">
        {#if riesgosPorDependencia.length > 0}
          <ul class="space-y-2">
            {#each riesgosPorDependencia as item}
              <li class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span class="text-sm text-gray-700">{item.dependencia?.nombre || item.nombre || 'Sin dependencia'}</span>
                <span class="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-primary rounded-full">{item.total || item.count || 0}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-sm text-gray-500 italic text-center py-6">Sin datos disponibles</p>
        {/if}
      </Card>

      <Card title="Riesgos Altos" icon="triangle-alert">
        {#if riesgosAltos.length > 0}
          <div class="space-y-3">
            {#each riesgosAltos as item}
              <div class="p-3 rounded-lg border border-red-200 bg-red-50">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-gray-900">{item.nombre || item.riesgo?.nombre || 'Sin nombre'}</span>
                  {@html nivelBadge(item.nivelResidual || item.nivel || 'ALTO')}
                </div>
                <p class="text-xs text-gray-500">{item.proceso?.nombre || item.riesgo?.proceso?.nombre || ''}</p>
                {#if item.causa || item.riesgo?.causa}
                  <p class="text-xs text-gray-600 mt-1 truncate">{item.causa || item.riesgo?.causa}</p>
                {/if}
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-sm text-gray-500 italic text-center py-6">Sin riesgos altos</p>
        {/if}
      </Card>
    </div>
  {/if}
</div>
