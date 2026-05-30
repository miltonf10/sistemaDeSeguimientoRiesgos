<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser } from '$lib/stores/auth';
  import { api } from '$lib/api/client';
  import Card from '$lib/ui/Card.svelte';
  import StatCard from '$lib/ui/StatCard.svelte';
  import RiskBadge from '$lib/ui/RiskBadge.svelte';
  import HeatMap from '$lib/ui/HeatMap.svelte';
  import Icon from '$lib/ui/Icon.svelte';

  let stats = $state({ totalRiesgos: 0, riesgosAltos: 0, totalControles: 0, totalEvaluaciones: 0, totalPlanes: 0 });
  let heatData = $state<{ x: string; y: string; value: number; label?: string }[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const [riesgos, planes, reportes] = await Promise.all([
        api.riesgos.list(),
        api.planesAccion.list(),
        api.reportes.riesgosAltos(),
      ]);
      stats = {
        totalRiesgos: riesgos.length,
        riesgosAltos: reportes.length,
        totalControles: 0,
        totalEvaluaciones: 0,
        totalPlanes: planes.length,
      };

      const niveles = ['Probabilidad', 'Impacto'];
      const valores = ['1 - Muy Bajo', '2 - Bajo', '3 - Medio', '4 - Alto', '5 - Muy Alto'];
      heatData = niveles.flatMap(n =>
        valores.map(v => ({
          x: n,
          y: v,
          value: Math.floor(Math.random() * 5) + 1,
        }))
      );
    } catch { /* ignore */ }
    finally { loading = false; }
  });

  const modules = [
    { href: '/activos', label: 'Activos', icon: 'folder-kanban', color: 'bg-emerald-500' },
    { href: '/riesgos', label: 'Riesgos', icon: 'triangle-alert', color: 'bg-amber-500' },
    { href: '/evaluaciones/inherente', label: 'Evaluaciones', icon: 'trending-up', color: 'bg-purple-500' },
    { href: '/controles', label: 'Controles', icon: 'shield-check', color: 'bg-rose-500' },
    { href: '/mapas/inherente', label: 'Mapas', icon: 'layout-dashboard', color: 'bg-cyan-500' },
    { href: '/reportes', label: 'Reportes', icon: 'inbox', color: 'bg-teal-500' },
    { href: '/auditoria', label: 'Auditor&iacute;a', icon: 'clipboard-check', color: 'bg-slate-600' },
    { href: '/usuarios', label: 'Configuraci&oacute;n', icon: 'settings', color: 'bg-gray-500' },
  ];

  const quickLinks = [
    { href: '/activos/nuevo', label: 'Nuevo Activo', desc: 'Registrar un activo de informaci&oacute;n', color: 'bg-blue-500', icon: 'plus' },
    { href: '/riesgos/nuevo', label: 'Nuevo Riesgo', desc: 'Identificar un nuevo riesgo', color: 'bg-amber-500', icon: 'plus' },
    { href: '/controles/nuevo', label: 'Nuevo Control', desc: 'Registrar un control existente', color: 'bg-purple-500', icon: 'plus' },
    { href: '/reportes', label: 'Reportes', desc: 'Exportar reportes consolidados', color: 'bg-teal-500', icon: 'plus' },
  ];
</script>

<div class="max-w-7xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Bienvenido, {$currentUser?.nombre}</h1>
      <p class="text-sm text-gray-500 mt-1">Panel de control &mdash; Gesti&oacute;n Integral de Riesgos Institucional</p>
    </div>
    <div class="flex items-center gap-2">
      <RiskBadge level="Alto" size="md" />
      <RiskBadge level="Medio" size="md" />
      <RiskBadge level="Bajo" size="md" />
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <StatCard label="Total Riesgos" value={String(stats.totalRiesgos)} icon="triangle-alert" color="red" trend={12} />
    <StatCard label="Riesgos Altos" value={String(stats.riesgosAltos)} icon="shield-check" color="yellow" trend={-5} />
    <StatCard label="Controles" value={String(stats.totalControles)} icon="clipboard-check" color="blue" />
    <StatCard label="Evaluaciones" value={String(stats.totalEvaluaciones)} icon="trending-up" color="purple" trend={8} />
    <StatCard label="Planes de Acci&oacute;n" value={String(stats.totalPlanes)} icon="inbox" color="green" />
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Mapa de Calor -->
    <div class="lg:col-span-2">
      <Card title="Mapa de Calor de Riesgos" icon="layout-dashboard">
        {#if heatData.length > 0}
          <HeatMap data={heatData} />
        {:else}
          <p class="text-gray-400 text-sm py-8 text-center">No hay datos disponibles</p>
        {/if}
      </Card>
    </div>

    <!-- Acciones R&aacute;pidas -->
    <div>
      <Card title="Acciones R&aacute;pidas" icon="settings">
        <div class="space-y-2">
          {#each quickLinks as link}
            <a href={link.href} class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center {link.color} shrink-0">
                <Icon name={link.icon || 'plus'} class="w-5 h-5 text-white" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 group-hover:text-primary transition">{link.label}</p>
                <p class="text-xs text-gray-500 truncate">{link.desc}</p>
              </div>
              <Icon name="chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-gray-500 ml-auto shrink-0 transition" />
            </a>
          {/each}
        </div>
      </Card>
    </div>
  </div>

  <!-- M&oacute;dulos del Sistema -->
  <Card title="M&oacute;dulos del Sistema" icon="layout-dashboard">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {#each modules as mod}
        <a href={mod.href} class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition bg-white">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center {mod.color}">
            <Icon name={mod.icon} class="w-6 h-6 text-white" />
          </div>
          <span class="text-sm font-medium text-gray-700">{mod.label}</span>
        </a>
      {/each}
    </div>
  </Card>
</div>
