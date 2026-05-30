<script lang="ts">
  import { api, setTokens, initTokens } from '$lib/api/client';
  import { currentUser, isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import Icon from '$lib/ui/Icon.svelte';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);
  let showPw = $state(false);

  async function handleLogin() {
    error = '';
    loading = true;
    try {
      const res = await api.auth.login(email, password);
      setTokens(res.accessToken, res.refreshToken);
      currentUser.set(res.usuario as any);
      isAuthenticated.set(true);
      goto('/');
    } catch (e: any) {
      error = e.message;
    } finally { loading = false; }
  }

  initTokens();
</script>

<div class="min-h-screen flex bg-[#1E1E2D]">
  <!-- Left panel - branding -->
  <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1E1E2D] to-[#2A2A3D] items-center justify-center p-12">
    <div class="max-w-md">
      <div class="w-16 h-16 bg-[#F5B700] rounded-2xl flex items-center justify-center mb-8">
        <Icon name="shield-check" class="w-9 h-9 text-[#1E1E2D]" />
      </div>
      <h1 class="text-3xl font-bold text-white mb-3">Gesti&oacute;n de Riesgos</h1>
      <p class="text-white/60 leading-relaxed">Plataforma institucional para la administraci&oacute;n integral de riesgos, activos de informaci&oacute;n, controles y planes de acci&oacute;n.</p>
      <div class="mt-8 space-y-4">
        <div class="flex items-center gap-3 text-white/70 text-sm">
          <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><div class="w-2 h-2 bg-green-500 rounded-full"></div></div>
          <span>Gesti&oacute;n de activos de informaci&oacute;n</span>
        </div>
        <div class="flex items-center gap-3 text-white/70 text-sm">
          <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><div class="w-2 h-2 bg-blue-500 rounded-full"></div></div>
          <span>Evaluaci&oacute;n y mapa de riesgos</span>
        </div>
        <div class="flex items-center gap-3 text-white/70 text-sm">
          <div class="w-6 h-6 rounded-full bg-[#F5B700]/20 flex items-center justify-center"><div class="w-2 h-2 bg-[#F5B700] rounded-full"></div></div>
          <span>Planes de acci&oacute;n y controles</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Right panel - login form -->
  <div class="flex-1 flex items-center justify-center p-6 bg-[#F5F7FA]">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8 lg:hidden">
        <div class="w-14 h-14 bg-[#F5B700] rounded-xl flex items-center justify-center mx-auto mb-4">
          <Icon name="shield-check" class="w-7 h-7 text-[#1E1E2D]" />
        </div>
        <h1 class="text-xl font-bold text-gray-900">Gesti&oacute;n de Riesgos</h1>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Iniciar Sesi&oacute;n</h2>
        <p class="text-sm text-gray-500 mb-6">Ingrese sus credenciales institucionales</p>

        <form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo electr&oacute;nico</label>
            <input type="email" bind:value={email} placeholder="admin@entidad.gov.co"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50 text-sm" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Contrase&ntilde;a</label>
            <div class="relative">
              <input type={showPw ? 'text' : 'password'} bind:value={password} placeholder="••••••••"
                class="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-gray-50/50 text-sm" required />
              <button type="button" onclick={() => showPw = !showPw} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                {#if showPw}<Icon name="eye-off" class="w-4 h-4" />{:else}<Icon name="eye" class="w-4 h-4" />{/if}
              </button>
            </div>
          </div>

          {#if error}
            <div class="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-100">{error}</div>
          {/if}

          <button type="submit" disabled={loading}
            class="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark disabled:bg-primary/60 text-white font-medium rounded-lg transition text-sm cursor-pointer flex items-center justify-center gap-2">
            {#if loading}
              <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {/if}
            {loading ? 'Iniciando sesi&oacute;n...' : 'Iniciar Sesi&oacute;n'}
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">&copy; 2026 Municipio &mdash; Plataforma Institucional de Gesti&oacute;n de Riesgos</p>
    </div>
  </div>
</div>
