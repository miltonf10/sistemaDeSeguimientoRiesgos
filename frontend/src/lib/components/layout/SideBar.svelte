<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { navStore } from '$lib/stores/nav.svelte';
  import Icon from '$lib/ui/Icon.svelte';

  let collapsed = $state(false);

  let currentModule = $derived(navStore.moduleFromPath($page.url.pathname) ?? navStore.activeModule);

  let activeLabel = $derived.by(() => {
    for (const item of currentModule.nav) {
      if ($page.url.pathname === item.route || $page.url.pathname.startsWith(item.route + '/')) {
        return item.label;
      }
    }
    return '';
  });

  function isActive(route: string) {
    return $page.url.pathname === route || $page.url.pathname.startsWith(route + '/');
  }

  function handleNav(route: string) {
    navStore.setRoute(route);
    goto(route);
  }
</script>

<aside
  class="bg-sidebar text-white flex flex-col shrink-0 transition-all duration-300 overflow-hidden z-40"
  class:w-64={!collapsed} class:w-16={collapsed}
>
  <div class="h-16 flex items-center gap-3 px-4 border-b border-white/5 shrink-0">
    <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background-color: var(--color-sidebar-active);">
      <Icon name="shield-check" class="w-5 h-5" style="color: var(--color-sidebar);" />
    </div>
    {#if !collapsed}
      <div class="truncate">
        <p class="text-sm font-bold text-white">Gesti&oacute;n de Riesgos</p>
        <p class="text-[10px] text-white/50">Plataforma Institucional</p>
      </div>
    {/if}
  </div>

  <div class="px-3 pt-4 pb-2 border-b border-white/5 shrink-0">
    {#if !collapsed}
      <div class="flex items-center gap-2.5 px-1">
        <Icon name={currentModule.icon} class="w-5 h-5" style="color: var(--color-module-primary);" />
        <div class="truncate min-w-0 flex-1">
          <p class="text-sm font-semibold text-white truncate">{currentModule.id}</p>
          <p class="text-[10px] text-white/40 truncate">{currentModule.description}</p>
        </div>
      </div>
    {/if}
  </div>

  <nav class="flex-1 overflow-y-auto py-2 px-2">
    {#if collapsed}
      <div class="flex flex-col items-center py-3 gap-1">
        <Icon name={currentModule.icon} class="w-5 h-5 mb-2" style="color: var(--color-module-primary);" title={currentModule.id} />
        {#each currentModule.nav as item}
          <button
            onclick={() => handleNav(item.route)}
            class="w-10 h-10 flex items-center justify-center rounded-lg transition cursor-pointer {isActive(item.route) ? 'bg-white/10' : 'hover:bg-white/5'}"
            title={item.label}
          >
            <Icon name={item.icon} class="w-5 h-5" style={isActive(item.route) ? 'color: var(--color-sidebar-active);' : 'color: var(--color-sidebar-text-muted);'} />
          </button>
        {/each}
      </div>
    {:else}
      {#each currentModule.nav as item}
        {@const active = isActive(item.route)}
        <a
          href={item.route}
          onclick={(e) => { e.preventDefault(); handleNav(item.route); }}
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition cursor-pointer mb-0.5 {active ? 'bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-active-text)]' : 'text-white/70 hover:bg-white/5'}"
        >
          <div class="w-5 h-5 flex items-center justify-center shrink-0">
            <Icon name={item.icon} class="w-4 h-4" />
          </div>
          <span class="flex-1 truncate">{item.label}</span>
          {#if active}
            <span class="text-[10px] font-bold opacity-60">&bull;</span>
          {/if}
        </a>
      {/each}
    {/if}
  </nav>

  <button
    onclick={() => collapsed = !collapsed}
    class="flex items-center justify-center h-12 border-t border-white/5 text-white/40 hover:text-white/80 hover:bg-white/5 transition cursor-pointer shrink-0"
  >
    <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} class="w-5 h-5" />
  </button>
</aside>
