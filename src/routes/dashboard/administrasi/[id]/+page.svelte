<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Button } from '$lib/components/ui/button';
	import Download from '@lucide/svelte/icons/download';
	import ScanEye from '@lucide/svelte/icons/scan-eye';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { doc } = data;
</script>

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
	<!-- Toolbar -->
	<div class="flex items-center justify-between rounded-lg border bg-muted/50 p-3 gap-3 flex-wrap">
		<div class="flex items-center gap-2">
			{#if doc.tipe === 'pdf'}
				<a
					href={doc.url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground gap-2 shrink-0"
				>
					<ScanEye class="h-4 w-4" />
					Buka Dokumen
				</a>
			{/if}
		</div>
	</div>

	{#if doc.tipe === 'pdf'}
		<!-- PDF: render via iframe -->
		<div class="flex-1 rounded-lg border bg-background overflow-hidden" style="min-height: 80vh;">
			<iframe src={doc.url} width="100%" height="100%" style="min-height: 80vh;" title={doc.nama}
			></iframe>
		</div>
	{/if}
</div>
