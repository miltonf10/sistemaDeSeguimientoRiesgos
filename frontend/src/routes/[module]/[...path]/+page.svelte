<script lang="ts">
  import { page } from '$app/stores';
  import { modules, navStore } from '$lib/stores/nav.svelte';
  import { goto } from '$app/navigation';
  import Icon from '$lib/ui/Icon.svelte';
  import Card from '$lib/ui/Card.svelte';

  let navItem = $derived.by(() => {
    const fullPath = '/' + [$page.params.module, $page.params.path].filter(Boolean).join('/');
    return navStore.activeModule.nav.find(i => fullPath === i.route || (i.route !== '/' + $page.params.module && fullPath.startsWith(i.route + '/')));
  });

  let pageLabel = $derived(navItem?.label || 'Dashboard');
  let pageIcon = $derived(navItem?.icon || 'home');

  $effect(() => {
    if ($page.params.module && !navItem) {
      const fullPath = '/' + [$page.params.module, $page.params.path].filter(Boolean).join('/');
      const anyMatch = modules.some(m => m.nav.some(i => fullPath === i.route));
      if (!anyMatch && $page.params.path) {
        goto('/' + $page.params.module);
      }
    }
  });
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
      style="background-color: color-mix(in srgb, var(--color-module-primary) 8%, transparent);"
    >
      <Icon name={pageIcon} class="w-5 h-5" style="color: var(--color-module-primary);" />
    </div>
    <div>
      <h1 class="text-xl font-bold text-gray-900">{pageLabel}</h1>
      <p class="text-sm text-gray-500">
        {navStore.activeModule.id} — {navStore.activeModule.description}
      </p>
    </div>
  </div>

  <Card title={pageLabel} icon={pageIcon}>
    <div class="text-center py-16">
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style="background-color: color-mix(in srgb, var(--color-module-primary) 6%, transparent);"
      >
        <Icon name={pageIcon} class="w-8 h-8" style="color: var(--color-module-primary);" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-1">
        {pageLabel}
      </h3>
      <p class="text-sm text-gray-500 max-w-md mx-auto">
        Esta sección está en desarrollo. Pronto podrás gestionar {pageLabel.toLowerCase()} desde aquí.
      </p>
    </div>
  </Card>
</div>
