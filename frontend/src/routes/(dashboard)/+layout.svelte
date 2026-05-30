<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser, isAuthenticated } from '$lib/stores/auth';
  import { api, initTokens, clearTokens, getAccessToken } from '$lib/api/client';
  import { goto } from '$app/navigation';
  import Icon from '$lib/ui/Icon.svelte';

  let { children }: { children: import('svelte').Snippet } = $props();
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    initTokens();
    if (!getAccessToken()) { goto('/login'); return; }
    try {
      const profile = await api.auth.profile();
      currentUser.set(profile);
      isAuthenticated.set(true);
    } catch (e: any) {
      error = e.message || 'Error de conexión con el servidor';
      clearTokens();
      goto('/login');
    } finally { loading = false; }
  });
</script>

{#if loading}
  <div class="h-full flex items-center justify-center">
    <div class="text-center">
      <Icon name="loader" class="w-10 h-10 text-primary animate-spin mx-auto" />
      <p class="mt-4 text-gray-500 text-sm">Cargando...</p>
    </div>
  </div>
{:else}
  {@render children()}
{/if}
