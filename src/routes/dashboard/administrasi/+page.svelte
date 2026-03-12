<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import FileText from '@lucide/svelte/icons/file-text';
	import FileIcon from '@lucide/svelte/icons/file';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Administrasi | Dashboard</title>
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
					<Breadcrumb.Page>Administrasi</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex flex-col gap-1">
		<h1 class="text-3xl font-bold tracking-tight">Administrasi</h1>
		<p class="text-muted-foreground">Unduh atau lihat dokumen administrasi praktikum.</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.dokumen as doc, i}
			<Card.Root class="flex flex-col">
				<Card.Header class="pb-3">
					<Card.Title class="text-base leading-snug">{doc.nama}</Card.Title>
					{#if doc.deskripsi}
						<Card.Description class="text-xs">{doc.deskripsi}</Card.Description>
					{/if}
				</Card.Header>
				<Card.Content class="flex-1 flex flex-col justify-end gap-3">
					<div class="bg-muted rounded-md p-3 flex items-center gap-3">
						{#if doc.tipe === 'pdf'}
							<FileText class="h-7 w-7 text-primary shrink-0" />
						{:else}
							<FileIcon class="h-7 w-7 text-blue-500 shrink-0" />
						{/if}
						<div class="flex-1 overflow-hidden">
							<p class="text-xs text-muted-foreground truncate">{doc.nama}</p>
						</div>
					</div>
					{#if doc.tipe === 'pdf'}
						<Button href="/dashboard/administrasi/{i}" class="w-full">Buka Dokumen</Button>
					{:else}
						<Button href={doc.url} download class="w-full">Unduh Dokumen</Button>
					{/if}
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
