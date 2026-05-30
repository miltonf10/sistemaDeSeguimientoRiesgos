<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores/auth';
  import { clearTokens } from '$lib/api/client';
  import { goto } from '$app/navigation';
  import { modules, navStore } from '$lib/stores/nav.svelte';
  import Icon from '$lib/ui/Icon.svelte';

  let showUserMenu = $state(false);

  let currentModule = $derived(navStore.moduleFromPath($page.url.pathname) ?? navStore.activeModule);

  let breadcrumbLabel = $derived.by(() => {
    const path = $page.url.pathname;
    for (const mod of modules) {
      for (const item of mod.nav) {
        if (path === item.route || path.startsWith(item.route + '/')) return item.label;
      }
    }
    const segments = path.split('/').filter(Boolean);
    return segments.pop() || 'Inicio';
  });

  function logout() {
    clearTokens();
    goto('/login');
  }

  function selectModule(id: string) {
    navStore.setModule(id);
    goto(navStore.activeModule.nav[0].route);
  }
</script>

<header class="h-16 bg-sidebar border-b border-white/5 flex items-center justify-between px-6 shrink-0 relative z-50">
  <div class="flex items-center gap-2 min-w-0">
    <span class="text-lg font-bold text-white/90 tracking-tight mr-2 shrink-0">&#x2B21; SRIESGO</span>
    <div class="flex items-center gap-1.5">
      {#each modules as mod}
        {@const active = mod.id === currentModule.id}
        <button
          onclick={() => selectModule(mod.id)}
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap {active ? 'bg-white/10' : 'hover:bg-white/5'}"
          style={active ? 'color: var(--color-module-primary); border: 1px solid color-mix(in srgb, var(--color-module-primary) 25%, transparent);' : 'color: rgba(255,255,255,0.4); border: 1px solid transparent;'}
        >
          <Icon name={mod.icon} class="w-4 h-4 shrink-0" />
          <div class="text-left">
            <p class="text-xs font-semibold">{mod.id}</p>
            <p class="text-[10px] text-white/40 leading-tight hidden xl:block">{mod.description}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <div class="flex items-center gap-4">
    <button class="relative p-2 rounded-lg hover:bg-white/5 transition cursor-pointer">
      <Icon name="bell" class="w-5 h-5 text-white/60" />
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>

    <div class="relative">
      <button onclick={() => showUserMenu = !showUserMenu} class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition cursor-pointer">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style="background-color: var(--color-module-primary);">
          {($currentUser?.nombre || 'U')[0]}
        </div>
        <div class="hidden sm:block text-left">
          <p class="text-sm font-medium text-white/90 leading-tight">{$currentUser?.nombre || 'Usuario'}</p>
          <p class="text-xs text-white/50">{$currentUser?.rol?.replace(/_/g, ' ') || ''}</p>
        </div>
        <Icon name="chevron-down" class="w-4 h-4 text-white/40" />
      </button>
      {#if showUserMenu}
        <div class="absolute right-0 mt-2 w-56 bg-sidebar rounded-xl border border-white/10 shadow-xl py-1 z-50">
          <div class="px-4 py-3 border-b border-white/5">
            <p class="text-sm font-medium text-white/90">{$currentUser?.nombre || 'Usuario'}</p>
            <p class="text-xs text-white/50">{$currentUser?.email || ''}</p>
          </div>
          <a href="/usuarios" class="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 transition"><Icon name="user" class="w-4 h-4" /> Mi Perfil</a>
          <button class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer" onclick={logout}><Icon name="log-out" class="w-4 h-4" /> Cerrar Sesi&oacute;n</button>
        </div>
      {/if}
    </div>
  </div>
</header>

<div class="h-9 bg-sidebar border-b border-white/5 flex items-center px-6 gap-1.5 text-xs shrink-0">
  <a href="/" class="text-white/50 hover:text-white/80 transition">Inicio</a>
  <span class="text-white/20 mx-1">/</span>
  <span class="font-medium" style="color: var(--color-module-primary);">{currentModule.id}</span>
  <span class="text-white/20 mx-1">/</span>
  <span class="text-white/80 font-medium">{breadcrumbLabel}</span>
</div>
