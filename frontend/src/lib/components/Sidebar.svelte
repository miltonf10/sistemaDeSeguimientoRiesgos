<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import Icon from '$lib/ui/Icon.svelte';

  let collapsed = $state(false);

  const sections = [
    { label: 'Dashboard', icon: 'layout-dashboard', items: [{ href: '/', label: 'Inicio' }, { href: '/dashboard/indicadores', label: 'Indicadores' }, { href: '/dashboard/resumen', label: 'Resumen General' }] },
    { label: 'Configuración', icon: 'settings', items: [{ href: '/usuarios', label: 'Usuarios' }, { href: '/roles', label: 'Roles' }, { href: '/dependencias', label: 'Dependencias' }, { href: '/procesos', label: 'Procesos' }] },
    { label: 'Activos', icon: 'folder-kanban', items: [{ href: '/activos', label: 'Listado' }, { href: '/activos/nuevo', label: 'Registrar Activo' }, { href: '/activos/clasificacion', label: 'Clasificación' }] },
    { label: 'Riesgos', icon: 'triangle-alert', items: [{ href: '/riesgos', label: 'Matriz de Riesgos' }, { href: '/riesgos/nuevo', label: 'Registrar Riesgo' }, { href: '/riesgos/proceso', label: 'Por Proceso' }, { href: '/riesgos/dependencia', label: 'Por Dependencia' }] },
    { label: 'Evaluación', icon: 'trending-up', items: [{ href: '/evaluaciones/probabilidad', label: 'Probabilidad' }, { href: '/evaluaciones/impacto', label: 'Impacto' }, { href: '/evaluaciones/inherente', label: 'Riesgo Inherente' }, { href: '/evaluaciones/residual', label: 'Riesgo Residual' }] },
    { label: 'Controles', icon: 'shield-check', items: [{ href: '/controles', label: 'Listado' }, { href: '/controles/nuevo', label: 'Registrar Control' }, { href: '/controles/evidencias', label: 'Evidencias' }, { href: '/controles/seguimiento', label: 'Seguimiento' }] },
    { label: 'Planes de Acción', icon: 'clipboard-check', items: [{ href: '/planes-accion', label: 'Listado' }] },
    { label: 'Mapas', icon: 'layout-dashboard', items: [{ href: '/mapas/inherente', label: 'Mapa Inherente' }, { href: '/mapas/residual', label: 'Mapa Residual' }, { href: '/mapas/comparativo', label: 'Comparativo' }] },
    { label: 'Reportes', icon: 'inbox', items: [{ href: '/reportes', label: 'Consolidado' }, { href: '/reportes/excel', label: 'Exportar Excel' }, { href: '/reportes/pdf', label: 'Exportar PDF' }] },
    { label: 'Auditoría', icon: 'clipboard-check', items: [{ href: '/auditoria', label: 'Historial' }, { href: '/auditoria/trazabilidad', label: 'Trazabilidad' }, { href: '/auditoria/logs', label: 'Logs' }] },
  ];

  let openSections = $state<Set<string>>(new Set(['Dashboard']));

  function toggleSection(label: string) {
    const s = new Set(openSections);
    if (s.has(label)) s.delete(label); else s.add(label);
    openSections = s;
  }

  function isActive(href: string) { return $page.url.pathname === href; }

  function isSectionActive(items: { href: string }[]) {
    return items.some(i => $page.url.pathname === i.href || $page.url.pathname.startsWith(i.href + '/'));
  }
</script>

<aside class="bg-sidebar text-white flex flex-col shrink-0 transition-all duration-300 overflow-hidden z-40"
  class:w-64={!collapsed} class:w-16={collapsed}>
  
  <!-- Logo -->
  <div class="h-16 flex items-center gap-3 px-4 border-b border-white/5 shrink-0">
    <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background-color: var(--color-sidebar-active);">
      <Icon name="shield-check" class="w-5 h-5" style="color: var(--color-sidebar);" />
    </div>
    {#if !collapsed}
      <div class="truncate">
        <p class="text-sm font-bold text-white">Gestión de Riesgos</p>
        <p class="text-[10px] text-white/50">Plataforma Institucional</p>
      </div>
    {/if}
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
    {#each sections as section}
      {@const active = isSectionActive(section.items)}
      {@const open = openSections.has(section.label)}
      <div>
        <button onclick={() => toggleSection(section.label)}
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer {active ? 'bg-[var(--color-sidebar-active)]/10 text-[var(--color-sidebar-active)]' : 'text-white/70 hover:bg-white/5'}">
            <Icon name={section.icon} class="w-5 h-5 shrink-0" />
          {#if !collapsed}
            <span class="flex-1 text-left truncate">{section.label}</span>
            <Icon name="chevron-down" class="w-4 h-4 transition-transform duration-200 {open ? 'rotate-0' : '-rotate-90'}" />
          {/if}
        </button>
        {#if open && !collapsed}
          <div class="ml-3 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
            {#each section.items as item}
              <a href={item.href}
                class="block px-3 py-2 rounded-lg text-sm transition {isActive(item.href) ? 'bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-active-text)]' : 'text-white/60 hover:bg-white/5'}">
                {item.label}
              </a>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </nav>

  <!-- Collapse button -->
  <button onclick={() => collapsed = !collapsed}
    class="flex items-center justify-center h-12 border-t border-white/5 text-white/40 hover:text-white/80 hover:bg-white/5 transition cursor-pointer">
    {#if collapsed}
      <Icon name="chevron-right" class="w-5 h-5" />
    {:else}
      <Icon name="chevron-left" class="w-5 h-5" />
    {/if}
  </button>
</aside>
