<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	// Active praktikumId from URL
	let selectedId = $derived($page.params.praktikumId ?? '');
</script>

<header
	class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
>
	<div class="flex items-center gap-2 px-4">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
		<Breadcrumb.Root class="hidden md:block">
			<Breadcrumb.List>
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class="hidden md:block" />
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link href="/dashboard/kelompok-praktikum">Kelompok Praktikum</Breadcrumb.Link>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-5 p-4 pt-0">
	<div class="flex flex-col gap-1">
		<h1 class="text-3xl font-bold tracking-tight">Jadwal &amp; Kelompok Praktikum</h1>
		<p class="text-muted-foreground">Pilih laboratorium untuk melihat pembagian jadwal asisten dan kelompok.</p>
	</div>

	<!-- Horizontal Pill Navigation -->
	<div 
		class="flex overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-1 scrollbar-none gap-2" 
		style="-webkit-overflow-scrolling: touch; mask-image: linear-gradient(to right, black 90%, transparent 100%);"
	>
		{#each data.praktikumList as item}
			<a
				href="/dashboard/kelompok-praktikum/{item.id}"
				class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0 {selectedId === item.id ? 'bg-primary text-primary-foreground shadow' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}"
			>
				{item.nama_praktikum}
			</a>
		{/each}
	</div>

	<!-- Child route content -->
	{@render children()}
</div>
