<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { enhance } from '$app/forms';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Upload from '@lucide/svelte/icons/upload';
	import FileText from '@lucide/svelte/icons/file-text';
	import CheckCircle from '@lucide/svelte/icons/circle-check';
	import type { PageData, ActionData } from './$types';
	import Loading from '$lib/components/loading.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const isAsisten = data.userData?.role === 'Asisten' || data.userData?.role === 'SU';

	// Upload form state
	let selectedDocId = $state('');
	let isUploading = $state(false);

	// Per-card delete state
	let deleting = $state<Record<string | number, boolean>>({});

	// Success banner state
	let showSuccess = $state(false);
	let successTimeout: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			clearTimeout(successTimeout);
			successTimeout = setTimeout(() => (showSuccess = false), 3000);
		}
	});

	// Dokumen tanpa file (dropdown upload)
	const dokumenTanpaFile = $derived(data.dokumenList.filter((d: any) => !d.url));

	// List tersortir: yang sudah ada dokumen tampil duluan (sama persis modul-praktikum)
	const sortedDokumenList = $derived(
		[...data.dokumenList].sort((a: any, b: any) => {
			if (a.url && !b.url) return -1;
			if (!a.url && b.url) return 1;
			return 0;
		})
	);
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
		<h2 class="text-3xl font-bold tracking-tight">Administrasi</h2>
	</div>

	<!-- Success banner -->
	{#if showSuccess}
		<div
			class="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
		>
			<CheckCircle class="h-5 w-5 shrink-0" />
			<p class="text-sm font-medium">{form?.message ?? 'Berhasil!'}</p>
		</div>
	{/if}

	<!-- Upload Section: hanya untuk Asisten & ada dokumen tanpa file -->
	{#if isAsisten && dokumenTanpaFile.length > 0}
		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-base">Unggah Dokumen Baru</Card.Title>
				<Card.Description>Pilih dokumen dan unggah file dokumen.</Card.Description>
			</Card.Header>
			<Card.Content>
				<form
					method="POST"
					action="?/upload"
					enctype="multipart/form-data"
					use:enhance={() => {
						isUploading = true;
						return async ({ update }) => {
							await update();
							isUploading = false;
							selectedDocId = '';
						};
					}}
					class="flex flex-col gap-3 sm:flex-row sm:items-end"
				>
					<div class="flex flex-col gap-1.5 sm:flex-1">
						<label for="doc-select" class="text-sm font-medium">Dokumen</label>
						<select
							id="doc-select"
							name="doc_id"
							required
							bind:value={selectedDocId}
							class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							<option value="" disabled>Pilih dokumen...</option>
							{#each dokumenTanpaFile as d}
								<option value={d.id}>{d.nama}</option>
							{/each}
						</select>
					</div>

					<div class="flex flex-col gap-1.5 sm:flex-1">
						<label for="doc-file" class="text-sm font-medium">File Dokumen</label>
						<Input
							id="doc-file"
							type="file"
							name="file"
							multiple={false}
							required
							class="cursor-pointer text-xs"
						/>
					</div>

					<Button
						type="submit"
						size="sm"
						class="gap-2 sm:shrink-0"
						disabled={isUploading || !selectedDocId}
					>
						{#if isUploading}
							<Loading variant="inline" message="Mengunggah..." />
						{:else}
							<Upload class="h-4 w-4" />
							Unggah Dokumen
						{/if}
					</Button>
				</form>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Card Grid: Tampilan dan style sama persis dengan modul-praktikum -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each sortedDokumenList as doc (doc.id)}
			<Card.Root class="flex flex-col">
				<Card.Header class="pb-3">
					<Card.Title class="text-base leading-snug">{doc.nama}</Card.Title>
					{#if doc.deskripsi}
						<Card.Description class="text-xs">{doc.deskripsi}</Card.Description>
					{/if}
				</Card.Header>
				<Card.Content class="flex-1 flex flex-col justify-end gap-3">
					{#if doc.url}
						<div class="bg-muted rounded-md p-3 flex items-center gap-3">
							<FileText class="h-7 w-7 text-primary shrink-0" />
							<div class="flex-1 overflow-hidden">
								<p class="text-xs font-medium">Dokumen tersedia</p>
							</div>
						</div>
						<Button href="/dashboard/administrasi/{doc.id}">Buka/Unduh Dokumen</Button>

						{#if isAsisten}
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => {
									deleting[doc.id] = true;
									return async ({ update }) => {
										await update();
										deleting[doc.id] = false;
									};
								}}
							>
								<input type="hidden" name="doc_id" value={doc.id} />
								<Button
									type="submit"
									variant="destructive"
									size="sm"
									class="w-full gap-2"
									disabled={deleting[doc.id]}
								>
									{#if deleting[doc.id]}
										<Loading variant="inline" message="Menghapus..." />
									{:else}
										<Trash2 class="h-4 w-4" />
										Hapus Dokumen
									{/if}
								</Button>
							</form>
						{/if}
					{:else}
						<div
							class="bg-muted/50 rounded-md border border-dashed p-3 flex items-center justify-center h-full text-muted-foreground text-xs"
						>
							Belum ada dokumen diunggah
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{/each}

		{#if data.dokumenList.length === 0}
			<div class="col-span-full py-10 text-center text-muted-foreground text-sm">
				Tidak ada data dokumen administrasi.
			</div>
		{/if}
	</div>
</div>
