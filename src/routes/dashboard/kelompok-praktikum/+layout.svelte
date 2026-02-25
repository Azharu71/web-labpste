<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	// Ambil praktikumId aktif dari URL
	let selectedId = $derived($page.params.praktikumId ?? '');

	function handleChange(e: Event) {
		const id = (e.target as HTMLSelectElement).value;
		if (id) {
			goto(`/dashboard/kelompok-praktikum/${id}`);
		} else {
			goto('/dashboard/kelompok-praktikum');
		}
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
					<Breadcrumb.Link href="/dashboard/kelompok-praktikum">Kelompok Praktikum</Breadcrumb.Link>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex flex-col gap-1">
		<h2 class="text-3xl font-bold tracking-tight">Daftar Kelompok dan Jadwal</h2>
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

	<!-- Child route content -->
	{@render children()}
</div>
