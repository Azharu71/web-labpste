<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import type { LayoutData } from './$types';
	import Info from '@lucide/svelte/icons/info';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Save from '@lucide/svelte/icons/save';
	import X from '@lucide/svelte/icons/x';
	import CheckCircle from '@lucide/svelte/icons/circle-check';
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { enhance } from '$app/forms';
	import Loading from '$lib/components/loading.svelte';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const isAsisten = $derived(data.userData?.role === 'Asisten' || data.userData?.role === 'SU');

	let selectedId = $state('');
	let formUrl = $derived(selectedId ? (data.praktikumList.find((p: any) => String(p.id) === selectedId)?.form_laporan || '') : '');
	let selectedName = $derived(
		data.praktikumList.find((p: any) => String(p.id) === selectedId)?.nama_praktikum || ''
	);

	// Edit state for Asisten
	let isEditing = $state(false);
	let editUrl = $state('');
	let isSubmitting = $state(false);
	let isDeleting = $state(false);

	// Success banner state (seperti modul-praktikum)
	let showSuccess = $state(false);
	let successMessage = $state('');
	let successTimeout: ReturnType<typeof setTimeout>;

	// Error banner state
	let showError = $state(false);
	let errorMessage = $state('');
	let errorTimeout: ReturnType<typeof setTimeout>;

	function showSuccessBanner(message: string) {
		showSuccess = true;
		successMessage = message;
		showError = false;
		clearTimeout(successTimeout);
		successTimeout = setTimeout(() => (showSuccess = false), 3000);
	}

	function showErrorBanner(message: string) {
		showError = true;
		errorMessage = message;
		showSuccess = false;
		clearTimeout(errorTimeout);
		errorTimeout = setTimeout(() => (showError = false), 5000);
	}

	function handleChange(e: Event) {
		selectedId = (e.target as HTMLSelectElement).value;
		isEditing = false;
	}

	function startEdit() {
		editUrl = formUrl;
		isEditing = true;
	}

	function cancelEdit() {
		isEditing = false;
		editUrl = '';
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

	<!-- Success banner (seperti modul-praktikum) -->
	{#if showSuccess}
		<div
			class="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
		>
			<CheckCircle class="h-5 w-5 shrink-0" />
			<p class="text-sm font-medium">{successMessage}</p>
		</div>
	{/if}

	<!-- Error banner -->
	{#if showError}
		<div
			class="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
		>
			<Info class="h-5 w-5 shrink-0" />
			<p class="text-sm font-medium">{errorMessage}</p>
		</div>
	{/if}

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
		<div class="flex flex-col items-center justify-center p-6 sm:p-10 mt-2 rounded-xl border border-dashed border-border bg-muted/40 gap-4 text-center">
			<div class="space-y-1">
				<h3 class="font-semibold text-lg">Form Pengumpulan Tersedia</h3>
				<p class="text-sm text-muted-foreground">Silakan kumpulkan laporan praktikum Anda melalui form berikut.</p>
			</div>
			<Button
				variant="default"
				size="lg"
				class="w-full sm:w-auto gap-2 px-8 shadow-sm transition-all"
				href={formUrl} 
				target="_blank"
			>
				Buka Form Pengumpulan
				<ExternalLink class="h-4 w-4" />
			</Button>

			<!-- Asisten: Edit & Delete Actions -->
			{#if isAsisten}
				{#if isEditing}
					<div class="w-full max-w-lg mt-2 rounded-lg border border-border bg-background p-4 shadow-sm">
						<form
							method="POST"
							action="/dashboard/pengumpulan-laporan?/update"
							use:enhance={() => {
								isSubmitting = true;
								return async ({ update, result }) => {
									await update();
									isSubmitting = false;
									if (result.type === 'success') {
										isEditing = false;
										editUrl = '';
										showSuccessBanner('Form pengumpulan berhasil diperbarui!');
									} else if (result.type === 'failure') {
										const msg = (result.data as any)?.message || 'Gagal memperbarui form pengumpulan.';
										showErrorBanner(msg);
									}
								};
							}}
							class="flex flex-col gap-3"
						>
							<input type="hidden" name="praktikum_id" value={selectedId} />
							<label for="edit-form-url" class="text-sm font-medium text-left">URL Form Pengumpulan</label>
							<Input
								id="edit-form-url"
								type="url"
								name="form_laporan"
								placeholder="https://forms.google.com/..."
								bind:value={editUrl}
								required
								class="w-full"
							/>
							<div class="flex gap-2 justify-end">
								<Button
									type="button"
									variant="outline"
									size="sm"
									class="gap-1.5"
									onclick={cancelEdit}
									disabled={isSubmitting}
								>
									<X class="h-3.5 w-3.5" />
									Batal
								</Button>
								<Button
									type="submit"
									size="sm"
									class="gap-1.5"
									disabled={isSubmitting || !editUrl}
								>
									{#if isSubmitting}
										<Loading variant="inline" message="Menyimpan..." />
									{:else}
										<Save class="h-3.5 w-3.5" />
										Simpan
									{/if}
								</Button>
							</div>
						</form>
					</div>
				{:else}
					<div class="flex gap-2 mt-1">
						<Button
							variant="outline"
							size="sm"
							class="gap-1.5"
							onclick={startEdit}
						>
							<Pencil class="h-3.5 w-3.5" />
							Edit URL Form
						</Button>
						<form
							method="POST"
							action="/dashboard/pengumpulan-laporan?/delete"
							use:enhance={() => {
								isDeleting = true;
								return async ({ update, result }) => {
									await update();
									isDeleting = false;
									if (result.type === 'success') {
										showSuccessBanner('Form pengumpulan berhasil dihapus!');
									} else if (result.type === 'failure') {
										const msg = (result.data as any)?.message || 'Gagal menghapus form pengumpulan.';
										showErrorBanner(msg);
									}
								};
							}}
						>
							<input type="hidden" name="praktikum_id" value={selectedId} />
							<Button
								type="submit"
								variant="destructive"
								size="sm"
								class="gap-1.5"
								disabled={isDeleting}
							>
								{#if isDeleting}
									<Loading variant="inline" message="Menghapus..." />
								{:else}
									<Trash2 class="h-3.5 w-3.5" />
									Hapus Form
								{/if}
							</Button>
						</form>
					</div>
				{/if}
			{/if}
		</div>
	{:else}
		<!-- No form URL available -->
		<div
			class="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3 rounded-lg border border-dashed border-border"
		>
			<Info class="size-12 opacity-50" />
			<p>Form pengumpulan laporan untuk <span class="font-semibold">{selectedName}</span> belum tersedia.</p>
			{#if isAsisten}
				<!-- Asisten: Add form URL -->
				{#if isEditing}
					<div class="w-full max-w-lg mt-4 rounded-lg border border-border bg-background p-4 shadow-sm text-left">
						<form
							method="POST"
							action="/dashboard/pengumpulan-laporan?/update"
							use:enhance={() => {
								isSubmitting = true;
								return async ({ update, result }) => {
									await update();
									isSubmitting = false;
									if (result.type === 'success') {
										isEditing = false;
										editUrl = '';
										showSuccessBanner('Form pengumpulan berhasil ditambahkan!');
									} else if (result.type === 'failure') {
										const msg = (result.data as any)?.message || 'Gagal menambahkan form pengumpulan.';
										showErrorBanner(msg);
									}
								};
							}}
							class="flex flex-col gap-3"
						>
							<input type="hidden" name="praktikum_id" value={selectedId} />
							<label for="add-form-url" class="text-sm font-medium">URL Form Pengumpulan</label>
							<Input
								id="add-form-url"
								type="url"
								name="form_laporan"
								placeholder="https://forms.google.com/..."
								bind:value={editUrl}
								required
								class="w-full"
							/>
							<div class="flex gap-2 justify-end">
								<Button
									type="button"
									variant="outline"
									size="sm"
									class="gap-1.5"
									onclick={cancelEdit}
									disabled={isSubmitting}
								>
									<X class="h-3.5 w-3.5" />
									Batal
								</Button>
								<Button
									type="submit"
									size="sm"
									class="gap-1.5"
									disabled={isSubmitting || !editUrl}
								>
									{#if isSubmitting}
										<Loading variant="inline" message="Menyimpan..." />
									{:else}
										<Save class="h-3.5 w-3.5" />
										Tambahkan
									{/if}
								</Button>
							</div>
						</form>
					</div>
				{:else}
					<Button
						variant="default"
						size="sm"
						class="gap-1.5 mt-2"
						onclick={startEdit}
					>
						<Pencil class="h-3.5 w-3.5" />
						Tambah URL Form
					</Button>
				{/if}
			{:else}
				<p class="text-xs">Hubungi asisten untuk informasi lebih lanjut.</p>
			{/if}
		</div>
	{/if}
</div>
