<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData } from './$types';
	import ScanEye from '@lucide/svelte/icons/scan-eye';

	let { data }: { data: PageData } = $props();
	const { praktikum } = data;
</script>

<svelte:head>
	<title>{praktikum.nama_praktikum} - Modul | Dashboard</title>
</svelte:head>

<header
	class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
>
	<div class="flex items-center gap-2 px-4">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
		<Breadcrumb.Root class="hidden md:block">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/dashboard/modul-praktikum">Modul Praktikum</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{praktikum.nama_praktikum}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<!-- Toolbar Khusus Mobile / Fallback Render PDF -->
	<div class="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
		<a
			href={praktikum.signedUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shrink-0 gap-2"
		>
			<ScanEye class="h-4 w-4" />
			Buka Dokumen
		</a>
	</div>

	<div class="flex-1 rounded-lg border bg-background overflow-hidden" style="min-height: 80vh;">
		<iframe
			src={praktikum.signedUrl}
			width="100%"
			height="100%"
			style="min-height: 80vh;"
			title="Modul {praktikum.nama_praktikum}"
		></iframe>
	</div>
</div>
