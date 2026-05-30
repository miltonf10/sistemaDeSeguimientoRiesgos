<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { initTokens } from '$lib/api/client';
	import { navStore } from '$lib/stores/nav.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import SideBar from '$lib/components/layout/SideBar.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	const moduleFromPath: Record<string, string> = {
		isms: 'ISMS',
		compliance: 'Compliance',
		orm: 'ORM',
		aml: 'AML',
		auditoria: 'Auditorías',
	};

	let isLoginPage = $derived($page.url.pathname === '/login');

	onMount(() => {
		initTokens();
	});

	$effect(() => {
		const firstSeg = $page.url.pathname.split('/')[1]?.toLowerCase() || '';
		const id = moduleFromPath[firstSeg];
		if (id && navStore.activeModuleId !== id) {
			navStore.activeModuleId = id;
		}
		document.documentElement.dataset.module = navStore.activeModuleId;
	});
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="flex flex-col h-screen overflow-hidden" style="background-color: var(--color-bg);">
		<div class="shrink-0">
			<TopBar />
		</div>
		<div class="flex flex-row flex-1 overflow-hidden">
			<SideBar />
			<main class="flex-1 overflow-y-auto p-6">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
