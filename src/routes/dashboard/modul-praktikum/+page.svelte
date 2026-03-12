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
	const isAsisten = data.userData.role === 'Asisten';

	// Upload form state
	let selectedPraktikumId = $state('');
	let isUploading = $state(false);

	// Per-card delete state
	let deleting = $state<Record<string, boolean>>({});

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

	// Praktikum tanpa modul (dropdown upload)
	const praktikumTanpaModul = $derived(data.praktikumList.filter((p) => !p.url_modul));

	// List tersortir: yang sudah ada modul tampil duluan
	const sortedPraktikumList = $derived(
		[...data.praktikumList].sort((a, b) => {
			if (a.url_modul && !b.url_modul) return -1;
			if (!a.url_modul && b.url_modul) return 1;
			return 0;
		})
	);
</script>

<svelte:head>
	<title>Modul praktikum | Dashboard</title>
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
					<Breadcrumb.Page>Modul praktikum</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex flex-col gap-1">
		<h1 class="text-3xl font-bold tracking-tight">Modul Praktikum</h1>
		<p class="text-muted-foreground">Unduh modul praktikum yang akan dilaksanakan.</p>
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

	<!-- Upload Section: hanya untuk Asisten & ada praktikum tanpa modul -->
	{#if isAsisten && praktikumTanpaModul.length > 0}
		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-base">Unggah Modul Baru</Card.Title>
				<Card.Description>Pilih praktikum dan unggah file PDF modul.</Card.Description>
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
							selectedPraktikumId = '';
						};
					}}
					class="flex flex-col gap-3 sm:flex-row sm:items-end"
				>
					<div class="flex flex-col gap-1.5 sm:flex-1">
						<label for="praktikum-select" class="text-sm font-medium">Praktikum</label>
						<select
							id="praktikum-select"
							name="praktikum_id"
							required
							bind:value={selectedPraktikumId}
							class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							<option value="" disabled>Pilih praktikum...</option>
							{#each praktikumTanpaModul as p}
								<option value={p.id}>{p.nama_praktikum}</option>
							{/each}
						</select>
					</div>

					<div class="flex flex-col gap-1.5 sm:flex-1">
						<label for="modul-file" class="text-sm font-medium">File PDF</label>
						<Input
							id="modul-file"
							type="file"
							name="modul"
							accept="application/pdf"
							multiple={false}
							required
							class="cursor-pointer text-xs"
						/>
					</div>

					<Button
						type="submit"
						size="sm"
						class="gap-2 w-full sm:w-auto sm:shrink-0"
						disabled={isUploading || !selectedPraktikumId}
					>
						{#if isUploading}
							<Loading variant="inline" message="Mengunggah..." />
						{:else}
							<Upload class="h-4 w-4" />
							Unggah PDF
						{/if}
					</Button>
				</form>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Card Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each sortedPraktikumList as praktikum (praktikum.id)}
			<Card.Root class="flex flex-col">
				<Card.Header class="pb-3">
					<Card.Title class="text-base leading-snug">{praktikum.nama_praktikum}</Card.Title>
					<Card.Description class="text-xs"
						>{praktikum.nama_lab} — {praktikum.semester}</Card.Description
					>
				</Card.Header>
				<Card.Content class="flex-1 flex flex-col justify-end gap-3">
					{#if praktikum.url_modul}
						<div class="bg-muted rounded-md p-3 flex items-center gap-3">
							<FileText class="h-7 w-7 text-primary shrink-0" />
							<div class="flex-1 overflow-hidden">
								<p class="text-xs font-medium">Modul tersedia</p>
							</div>
						</div>
						<Button href="/dashboard/modul-praktikum/{praktikum.id}">Buka/Unduh Dokumen</Button>

						{#if isAsisten}
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => {
									deleting[praktikum.id] = true;
									return async ({ update }) => {
										await update();
										deleting[praktikum.id] = false;
									};
								}}
							>
								<input type="hidden" name="praktikum_id" value={praktikum.id} />
								<Button
									type="submit"
									variant="destructive"
									size="sm"
									class="w-full gap-2"
									disabled={deleting[praktikum.id]}
								>
									{#if deleting[praktikum.id]}
										<Loading variant="inline" message="Menghapus..." />
									{:else}
										<Trash2 class="h-4 w-4" />
										Hapus Modul
									{/if}
								</Button>
							</form>
						{/if}
					{:else}
						<div
							class="bg-muted/50 rounded-md border border-dashed p-3 flex items-center justify-center h-full text-muted-foreground text-xs"
						>
							Belum ada modul diunggah
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{/each}

		{#if data.praktikumList.length === 0}
			<div class="col-span-full py-10 text-center text-muted-foreground text-sm">
				Tidak ada data praktikum semester genap.
			</div>
		{/if}
	</div>
</div>
