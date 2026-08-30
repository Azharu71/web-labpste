<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import type { LayoutData } from './$types';
	import Info from '@lucide/svelte/icons/info';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	// Google Form URLs mapped by praktikum ID
	// Replace these placeholder URLs with actual Google Form links
	const googleFormUrls: Record<string, string> = {};

	let selectedId = $state('');
	let formUrl = $derived(selectedId ? (googleFormUrls[selectedId] || '') : '');
	let selectedName = $derived(
		data.praktikumList.find((p: any) => String(p.id) === selectedId)?.nama_praktikum || ''
	);

	function handleChange(e: Event) {
		selectedId = (e.target as HTMLSelectElement).value;
	}
</script>

<header
	class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
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
					<Breadcrumb.Link href="/dashboard/pengumpulan-laporan">Pengumpulan Laporan</Breadcrumb.Link>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex flex-col gap-1">
		<h2 class="text-3xl font-bold tracking-tight">Pengumpulan Laporan</h2>
	</div>

	<!-- Dropdown Pilih Praktikum -->
	<div class="flex flex-wrap items-center gap-2">
		<label for="praktikum-select" class="text-sm font-medium shrink-0">Pilih Praktikum:</label>
		<select
			id="praktikum-select"
			value={selectedId}
			onchange={handleChange}
			class="flex h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-0"
		>
			<option value="">Pilih Praktikum</option>
			{#each data.praktikumList as item}
				<option value={item.id}>{item.nama_praktikum}</option>
			{/each}
		</select>
	</div>

	<!-- Google Form Embed or Placeholder -->
	{#if !selectedId}
		{@render children()}
	{:else if formUrl}
		<div class="flex flex-col gap-2">
			<div class="w-full rounded-lg border border-border overflow-hidden bg-background">
				<iframe
					src={formUrl}
					title="Form Pengumpulan Laporan - {selectedName}"
					class="w-full border-0"
					style="height: 80vh; min-height: 500px;"
					loading="lazy"
				>
					Loading…
				</iframe>
			</div>
		</div>
	{:else}
		<div
			class="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3 rounded-lg border border-dashed border-border"
		>
			<Info class="size-12 opacity-50" />
			<p>Form pengumpulan laporan untuk <span class="font-semibold">{selectedName}</span> belum tersedia.</p>
			<p class="text-xs">Hubungi asisten untuk informasi lebih lanjut.</p>
		</div>
	{/if}
</div>
