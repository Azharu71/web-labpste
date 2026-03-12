<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Data is now coming from layout server load - cached and optimized
	const userData = data.userData;
</script>

<header
	class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
>
	<div class="flex items-center gap-2 px-4">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class="hidden md:block" />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Nilai Praktikum</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>
<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex flex-col gap-1">
		<h1 class="text-3xl font-bold tracking-tight">Daftar Nilai Praktikum</h1>
		<p class="text-muted-foreground">
			Daftar Keseluruhan Nilai Praktikum Laboratorium Program Studi Teknik Elektro
		</p>
	</div>
	<div class="text-center py-12">
		<p class="text-sm font-medium text-foreground mb-1">Fitur dalam pengembangan</p>
		<p class="text-xs text-muted-foreground">Halaman ini belum tersedia. Silakan kembali lagi nanti.</p>
	</div>
</div>
