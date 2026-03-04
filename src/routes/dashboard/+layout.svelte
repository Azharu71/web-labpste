<script lang="ts">
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Loading from '$lib/components/loading.svelte';
	import { navigating } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar userData={data.userData} />
	<Sidebar.Inset>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>

{#if $navigating}
	<Loading variant="overlay" message="Memuat halaman..." />
{/if}
