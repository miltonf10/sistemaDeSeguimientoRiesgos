<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores/auth';
  import { clearTokens } from '$lib/api/client';
  import { goto } from '$app/navigation';
  import Icon from '$lib/ui/Icon.svelte';

  let showUserMenu = $state(false);

  const breadcrumbMap: Record<string, string> = {
    '/': 'Dashboard',
    '/dashboard/indicadores': 'Indicadores',
    '/dashboard/resumen': 'Resumen General',
    '/usuarios': 'Usuarios',
    '/roles': 'Roles',
    '/dependencias': 'Dependencias',
    '/procesos': 'Procesos',
    '/activos': 'Activos de Informaci&oacute;n',
    '/activos/nuevo': 'Registrar Activo',
    '/activos/clasificacion': 'Clasificaci&oacute;n de Activos',
    '/riesgos': 'Matriz de Riesgos',
    '/riesgos/nuevo': 'Registrar Riesgo',
    '/riesgos/proceso': 'Riesgos por Proceso',
    '/riesgos/dependencia': 'Riesgos por Dependencia',
    '/evaluaciones/probabilidad': 'Probabilidad',
    '/evaluaciones/impacto': 'Impacto',
    '/evaluaciones/inherente': 'Riesgo Inherente',
    '/evaluaciones/residual': 'Riesgo Residual',
    '/controles': 'Controles',
    '/controles/nuevo': 'Registrar Control',
    '/controles/evidencias': 'Evidencias',
    '/controles/seguimiento': 'Seguimiento',
    '/mapas/inherente': 'Mapa Inherente',
    '/mapas/residual': 'Mapa Residual',
    '/mapas/comparativo': 'Mapa Comparativo',
    '/reportes': 'Consolidado',
    '/reportes/excel': 'Exportar Excel',
    '/reportes/pdf': 'Exportar PDF',
    '/auditoria': 'Historial',
    '/auditoria/trazabilidad': 'Trazabilidad',
    '/auditoria/logs': 'Logs de Auditor&iacute;a',
    '/planes-accion': 'Planes de Acci&oacute;n',
  };

  let crumbs = $derived.by(() => {
    const path = $page.url.pathname;
    const parts: { label: string; href: string }[] = [{ label: 'Inicio', href: '/' }];
    if (path !== '/') {
      const label = breadcrumbMap[path];
      if (label) parts.push({ label, href: path });
    }
    return parts;
  });

  function logout() {
    clearTokens();
    goto('/login');
  }
</script>

<header class="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 shrink-0">
  <div class="flex items-center gap-2 text-sm">
    {#each crumbs as crumb, i}
      {#if i > 0}
        <span class="text-gray-300 mx-1">/</span>
      {/if}
      <a href={crumb.href} class="hover:text-primary transition {i === crumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}">{crumb.label}</a>
    {/each}
  </div>

  <div class="flex items-center gap-4">
    <button class="relative p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
      <Icon name="bell" class="w-5 h-5 text-gray-500" />
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>

    <div class="relative">
      <button onclick={() => showUserMenu = !showUserMenu} class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
          {($currentUser?.nombre || 'U')[0]}
        </div>
        <div class="hidden sm:block text-left">
          <p class="text-sm font-medium text-gray-900 leading-tight">{$currentUser?.nombre || 'Usuario'}</p>
          <p class="text-xs text-gray-500">{$currentUser?.rol?.replace('_', ' ') || ''}</p>
        </div>
        <Icon name="chevron-down" class="w-4 h-4 text-gray-400" />
      </button>
      {#if showUserMenu}
        <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-900">{$currentUser?.nombre || 'Usuario'}</p>
            <p class="text-xs text-gray-500">{$currentUser?.email || ''}</p>
          </div>
          <a href="/usuarios" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"><Icon name="user" class="w-4 h-4" /> Mi Perfil</a>
          <button class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer" onclick={logout}><Icon name="log-out" class="w-4 h-4" /> Cerrar Sesi&oacute;n</button>
        </div>
      {/if}
    </div>
  </div>
</header>
