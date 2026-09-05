<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData } from './$types';
	import ScanEye from '@lucide/svelte/icons/scan-eye';

	let { data }: { data: PageData } = $props();
	const { doc } = data;
</script>

<svelte:head>
	<title>{doc.nama} - Dokumen | Dashboard</title>
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
					<Breadcrumb.Link href="/dashboard/administrasi">Administrasi</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{doc.nama}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	{#if doc.signedUrl}
		<!-- Toolbar Khusus Mobile / Fallback Render PDF -->
		<div class="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
			<a
				href={doc.signedUrl}
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
				src={doc.signedUrl}
				width="100%"
				height="100%"
				style="min-height: 80vh;"
				title="Dokumen {doc.nama}"
			></iframe>
		</div>
	{:else}
		<div class="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center gap-4 bg-muted/30 my-auto">
			<div class="rounded-full bg-amber-100 p-4 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
				<ScanEye class="h-8 w-8" />
			</div>
			<div class="space-y-2 max-w-md">
				<h3 class="text-lg font-semibold">Berkas Dokumen Tidak Ditemukan</h3>
				<p class="text-sm text-muted-foreground">
					Berkas fisik untuk dokumen <span class="font-medium text-foreground">{doc.nama}</span> belum tersedia atau telah dipindahkan dari penyimpanan server.
				</p>
			</div>
			<a
				href="/dashboard/administrasi"
				class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
			>
				Kembali ke Administrasi
			</a>
		</div>
	{/if}
</div>
