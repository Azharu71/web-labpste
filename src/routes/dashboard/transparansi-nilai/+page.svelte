<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	import AwardIcon from '@lucide/svelte/icons/award';
	import MegaphoneIcon from '@lucide/svelte/icons/megaphone';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import UserCheckIcon from '@lucide/svelte/icons/user-check';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData, ActionData } from './$types';
	import Loading from '$lib/components/loading.svelte';
	import { enhance } from '$app/forms';
	// Create a type for the praktikum score data
	interface PraktikumScore {
		id: number;
		praktikum_id: string;
		nim: string;
		nama: string;
		praktikum_u1: number | null;
		laporan_u1: number | null;
		total_nilai_u1: number | null;
		praktikum_u2: number | null;
		laporan_u2: number | null;
		total_nilai_u2: number | null;
		praktikum_u3: number | null;
		laporan_u3: number | null;
		total_nilai_u3: number | null;
		praktikum_u4: number | null;
		laporan_u4: number | null;
		total_nilai_u4: number | null;
		praktikum_u5: number | null;
		laporan_u5: number | null;
		total_nilai_u5: number | null;
		praktikum_u6: number | null;
		laporan_u6: number | null;
		total_nilai_u6: number | null;
		praktikum_u7: number | null;
		laporan_u7: number | null;
		total_nilai_u7: number | null;
		praktikum_u8: number | null;
		laporan_u8: number | null;
		total_nilai_u8: number | null;
		sosialisasi: number | null;
		responsi: number | null;
		absolut: number | null;
		grade: string | null;
		list_praktikum:
			| {
					id: string;
					nama_praktikum: string;
					nama_lab: string;
					semester: string;
			  }[]
			| {
					id: string;
					nama_praktikum: string;
					nama_lab: string;
					semester: string;
			  }
			| null;
	}

	let {
		data,
		form
	}: {
		data: PageData & { praktikumScores: PraktikumScore[] };
		form: ActionData;
	} = $props();

	let isUploading = $state(false);
	let selectedPraktikumId = $state('');

	let showMessage = $state(false);
	let messageTimeout: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (form) {
			showMessage = true;
			clearTimeout(messageTimeout);
			messageTimeout = setTimeout(() => (showMessage = false), 5000);
		}
	});

	// Data is now coming from layout server load - cached and optimized
	const userData = data.userData;
	const praktikumScores = data.praktikumScores || [];
	const isAsisten = data.userData.role === 'Asisten';

	// Helper function to safely get praktikum info
	function getPraktikumInfo(scoreData: PraktikumScore) {
		const praktikum = Array.isArray(scoreData.list_praktikum)
			? scoreData.list_praktikum[0]
			: scoreData.list_praktikum;
		return praktikum;
	}

	console.log(praktikumScores);

	// Helper function to get unit scores
	function getUnitScores(score: PraktikumScore, unitNumber: number) {
		const praktikum = score[`praktikum_u${unitNumber}` as keyof PraktikumScore] as number | null;
		const laporan = score[`laporan_u${unitNumber}` as keyof PraktikumScore] as number | null;
		const total = score[`total_nilai_u${unitNumber}` as keyof PraktikumScore] as number | null;

		return {
			praktikum: praktikum?.toFixed(2) || '-',
			laporan: laporan?.toFixed(2) || '-',
			total: total?.toFixed(2) || '-',
			hasData: praktikum !== null || laporan !== null || total !== null
		};
	}

	// Helper function to get grade color and variant
	function getGradeStyle(grade: string | null) {
		switch (grade) {
			case 'A':
				return { color: 'text-green-600', bgColor: 'bg-green-100', variant: 'default' as const };
			case 'A-':
				return { color: 'text-green-400', bgColor: 'bg-green-100', variant: 'default' as const };
			case 'B+':
				return { color: 'text-blue-600', bgColor: 'bg-blue-100', variant: 'secondary' as const };
			case 'B':
				return { color: 'text-blue-400', bgColor: 'bg-blue-100', variant: 'secondary' as const };
			case 'B-':
				return { color: 'text-blue-200', bgColor: 'bg-blue-100', variant: 'secondary' as const };
			case 'C':
				return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', variant: 'outline' as const };
			case 'D':
				return {
					color: 'text-orange-600',
					bgColor: 'bg-orange-100',
					variant: 'destructive' as const
				};
			case 'E':
				return { color: 'text-red-600', bgColor: 'bg-red-100', variant: 'destructive' as const };
			default:
				return { color: 'text-gray-600', bgColor: 'bg-gray-100', variant: 'secondary' as const };
		}
	}
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
					<Breadcrumb.Page>Transparansi Nilai</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>
<div class="flex flex-1 flex-col gap-6 p-4 pt-0">
	<!-- Header Section -->
	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-bold tracking-tight">Transparansi Nilai Praktikum</h1>
		<p class="text-muted-foreground">
			Lihat detail nilai dan progress praktikum Anda secara transparan
		</p>
	</div>
	{#if isAsisten}
		<Card.Root class="p-6 border-dashed border-2">
			<Card.Header>
				<Card.Title class="text-xl font-bold"
					>Menu Unggah Nilai Praktikum (Admin/Asisten)</Card.Title
				>
				<Card.Description>Unggah berkas Nilai dengan formatCSV</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if form && showMessage}
					{#if form.success}
						<div
							class="mb-4 p-4 text-sm text-green-800 bg-green-100 rounded-lg border border-green-200 dark:bg-gray-800 dark:text-green-400"
							role="alert"
						>
							<span class="font-medium">Berhasil!</span>
							{form.message}
						</div>
					{:else if form.error}
						<div
							class="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg border border-red-200 dark:bg-gray-800 dark:text-red-400"
							role="alert"
						>
							<span class="font-medium">Gagal!</span>
							{form.error}
						</div>
					{/if}
				{/if}
				<form
					method="POST"
					action="?/uploadNilai"
					enctype="multipart/form-data"
					class="space-y-4"
					use:enhance={() => {
						isUploading = true;
						return async ({ update }) => {
							await update();
							isUploading = false;
							selectedPraktikumId = '';
						};
					}}
				>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="flex flex-col gap-1">
							<label for="praktikum_id" class="text-sm font-medium">Pilih Praktikum Target</label>
							<select
								id="praktikum_id"
								name="praktikum_id"
								required
								bind:value={selectedPraktikumId}
								disabled={isUploading}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="" disabled>Pilih Praktikum</option>
								<option value="prak-dasel-2627">Praktikum Dasar Elektronika</option>
								<option value="prak-skd-2627">Praktikum Sistem Kendali Digital</option>
								<option value="prak-penglis-2627">Praktikum Pengukuran Listrik</option>
								<option value="prak-meli-2627">Praktikum Medan Listrik</option>
								<option value="prak-komnum-2627">Praktikum Komputasi Numerik</option>
								<option value="prak-ik-2627">Praktikum Instrumentasi Kendali</option>
								<option value="prak-dsk-2627">Praktikum Dasar Sistem Kendali</option>
							</select>
						</div>
						<div class="flex flex-col gap-1">
							<label for="file" class="text-sm font-medium">Pilih File CSV Template Nilai</label>
							<input
								type="file"
								id="file"
								name="file"
								accept=".csv"
								required
								disabled={isUploading}
								class="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-12"
							/>
						</div>
					</div>
					<Button
						type="submit"
						disabled={isUploading || !selectedPraktikumId}
					>
						{#if isUploading}
							<Loading variant="inline" message="Mengunggah..." />
						{:else}
							Upload nilai
						{/if}
					</Button>
				</form>
			</Card.Content>
		</Card.Root>
	{/if}
	<!-- {#if false} -->
	<!-- Student Profile Card -->
	<div
		class="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
	>
		<div class="flex flex-col sm:flex-row sm:items-center gap-6">
			<!-- Avatar and Basic Info -->
			<div class="flex items-center gap-4">
				<Avatar.Root class="h-20 w-20 border-4 border-background shadow-lg">
					<Avatar.Fallback class="text-xl font-bold bg-primary text-primary-foreground">
						{praktikumScores[0]?.nama
							? praktikumScores[0]?.nama.substring(0, 2).toUpperCase()
							: 'UN'}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="space-y-2">
					<h2 class="text-2xl font-bold">
						{praktikumScores[0]?.nama?.toUpperCase() || 'NAMA TIDAK TERSEDIA'}
					</h2>
					<div class="flex items-center gap-2">
						<Badge variant="secondary" class="bg-blue-500 text-white">
							{userData.nim || 'NIM tidak tersedia'}
						</Badge>
					</div>
				</div>
			</div>

			<!-- Quick Stats -->
			{#if praktikumScores.length > 0}
				<div class="flex-1 flex justify-center sm:justify-end sm:ml-auto">
					<div class="text-center">
						<div class="text-2xl font-bold text-primary">
							{praktikumScores.length}
						</div>
						<p class="text-xs text-muted-foreground">Praktikum Diambil</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<!-- {/if} -->

	<!-- Praktikum Scores Section -->
	<div class="space-y-4">
		{#if praktikumScores.length > 0}
			<div class="flex items-center gap-2 mb-6">
				<BookOpenIcon class="h-6 w-6 text-primary" />
				<h2 class="text-xl font-semibold">Detail Nilai Praktikum</h2>
				<Badge variant="secondary" class="ml-auto">
					{praktikumScores.length} Praktikum
				</Badge>
			</div>

			<Accordion.Root type="single" class="space-y-4">
				{#each praktikumScores as scoreData, index}
					{@const gradeStyle = getGradeStyle(scoreData.grade)}

					<Card.Root class="overflow-hidden transition-all hover:shadow-md">
						<Accordion.Item value="item-{index + 1}" class="border-none">
							<Accordion.Trigger class="hover:no-underline px-6 py-4 hover:bg-muted/50">
								<div class="flex items-center justify-between w-full">
									<div class="flex items-center gap-4">
										<div class="p-2 rounded-lg bg-primary/10">
											<BookOpenIcon class="h-5 w-5 text-primary" />
										</div>
										<div class="text-left">
											<h3 class="font-semibold text-base">
												{getPraktikumInfo(scoreData)?.nama_praktikum ||
													`Praktikum ${scoreData.praktikum_id}`}
											</h3>
											<p class="text-sm text-muted-foreground">
												{getPraktikumInfo(scoreData)?.nama_lab || 'Lab'} • {getPraktikumInfo(
													scoreData
												)?.semester || 'Semester'}
											</p>
										</div>
									</div>
									<div class="flex items-center gap-3">
										{#if scoreData.grade}
											<Badge
												class={gradeStyle.bgColor + ' ' + gradeStyle.color}
												variant={gradeStyle.variant}
											>
												Grade {scoreData.grade}
											</Badge>
										{/if}
										{#if scoreData.absolut}
											<div class="text-right">
												<div class="text-lg font-bold text-primary">
													{scoreData.absolut?.toFixed(2) || '-'}
												</div>
												<div class="text-xs text-muted-foreground">Absolut</div>
											</div>
										{/if}
									</div>
								</div>
							</Accordion.Trigger>
							<Accordion.Content class="px-6 pb-6">
								<!-- Overall Scores -->
								<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
									<Card.Root class="transition-all hover:shadow-sm">
										<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
											<Card.Title class="text-sm font-medium">Sosialisasi</Card.Title>
											<MegaphoneIcon class="h-4 w-4 text-muted-foreground" />
										</Card.Header>
										<Card.Content>
											<div class="text-2xl font-bold text-primary">
												{scoreData.sosialisasi?.toFixed(2) || '-'}
											</div>
										</Card.Content>
									</Card.Root>

									<Card.Root class="transition-all hover:shadow-sm">
										<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
											<Card.Title class="text-sm font-medium">Responsi</Card.Title>
											<CheckCircleIcon class="h-4 w-4 text-muted-foreground" />
										</Card.Header>
										<Card.Content>
											<div class="text-2xl font-bold text-primary">
												{scoreData.responsi?.toFixed(2) || '-'}
											</div>
										</Card.Content>
									</Card.Root>

									<Card.Root class="transition-all hover:shadow-sm">
										<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
											<Card.Title class="text-sm font-medium">Absolut</Card.Title>
											<UserCheckIcon class="h-4 w-4 text-muted-foreground" />
										</Card.Header>
										<Card.Content>
											<div class="text-2xl font-bold text-primary">
												{scoreData.absolut?.toFixed(2) || '-'}
											</div>
										</Card.Content>
									</Card.Root>

									<Card.Root class="transition-all hover:shadow-sm">
										<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
											<Card.Title class="text-sm font-medium">Grade Akhir</Card.Title>
											<AwardIcon class="h-4 w-4 text-muted-foreground" />
										</Card.Header>
										<Card.Content>
											{#if scoreData.grade}
												<Badge
													class={gradeStyle.bgColor + ' ' + gradeStyle.color + ' text-xl px-3 py-2'}
													variant={gradeStyle.variant}
												>
													{scoreData.grade}
												</Badge>
											{:else}
												<div class="text-2xl font-bold text-muted-foreground">-</div>
											{/if}
										</Card.Content>
									</Card.Root>
								</div>

								<Separator class="my-6" />

								<!-- Unit Details -->
								<div>
									<div class="flex items-center gap-2 mb-4">
										<BookOpenIcon class="h-5 w-5 text-primary" />
										<h3 class="text-lg font-semibold">Detail Nilai Per Unit</h3>
									</div>

									<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										{#each Array(8) as _, unitIndex}
											{@const unitNumber = unitIndex + 1}
											{@const unitScores = getUnitScores(scoreData, unitNumber)}
											{#if unitScores.praktikum !== '-' || unitScores.laporan !== '-' || unitScores.total !== '-'}
												<Card.Root class="transition-all hover:shadow-sm">
													<Card.Header class="pb-3">
														<div class="flex items-center justify-between">
															<div class="flex items-center gap-2">
																<div class="p-1.5 rounded bg-primary/10">
																	<BookOpenIcon class="h-4 w-4 text-primary" />
																</div>
																<Card.Title class="text-base">Unit {unitNumber}</Card.Title>
															</div>
															{#if unitScores.total !== '-'}
																<Badge
																	class={getGradeStyle(unitScores.total).bgColor +
																		' ' +
																		getGradeStyle(unitScores.total).color}
																	variant={getGradeStyle(unitScores.total).variant}
																>
																	{unitScores.total}
																</Badge>
															{:else}
																<Badge variant="outline" class="text-muted-foreground">Belum</Badge>
															{/if}
														</div>
													</Card.Header>
													<Card.Content class="space-y-3">
														<div class="flex justify-between items-center">
															<span class="text-sm font-medium flex items-center gap-1">
																<CalendarIcon class="h-3 w-3" />
																Praktikum
															</span>
															{#if unitScores.praktikum !== '-'}
																<Badge
																	class={getGradeStyle(unitScores.praktikum).bgColor +
																		' ' +
																		getGradeStyle(unitScores.praktikum).color}
																	variant={getGradeStyle(unitScores.praktikum).variant}
																>
																	{unitScores.praktikum}
																</Badge>
															{:else}
																<span class="text-sm text-muted-foreground">-</span>
															{/if}
														</div>
														<div class="flex justify-between items-center">
															<span class="text-sm font-medium flex items-center gap-1">
																<FileTextIcon class="h-3 w-3" />
																Laporan
															</span>
															{#if unitScores.laporan !== '-'}
																<Badge
																	class={getGradeStyle(unitScores.laporan).bgColor +
																		' ' +
																		getGradeStyle(unitScores.laporan).color}
																	variant={getGradeStyle(unitScores.laporan).variant}
																>
																	{unitScores.laporan}
																</Badge>
															{:else}
																<span class="text-sm text-muted-foreground">-</span>
															{/if}
														</div>
													</Card.Content>
												</Card.Root>
											{:else}
												<Card.Root class="opacity-50">
													<Card.Header class="pb-3">
														<div class="flex items-center justify-between">
															<div class="flex items-center gap-2">
																<div class="p-1.5 rounded bg-muted">
																	<BookOpenIcon class="h-4 w-4 text-muted-foreground" />
																</div>
																<Card.Title class="text-base text-muted-foreground"
																	>Unit {unitNumber}</Card.Title
																>
															</div>
															<Badge variant="outline" class="text-muted-foreground">
																Belum Ada
															</Badge>
														</div>
													</Card.Header>
													<Card.Content class="space-y-3">
														<div class="flex justify-between items-center">
															<span class="text-sm text-muted-foreground flex items-center gap-1">
																<CalendarIcon class="h-3 w-3" />
																Praktikum
															</span>
															<span class="text-sm text-muted-foreground">-</span>
														</div>
														<div class="flex justify-between items-center">
															<span class="text-sm text-muted-foreground flex items-center gap-1">
																<FileTextIcon class="h-3 w-3" />
																Laporan
															</span>
															<span class="text-sm text-muted-foreground">-</span>
														</div>
													</Card.Content>
												</Card.Root>
											{/if}
										{/each}
									</div>
								</div>
							</Accordion.Content>
						</Accordion.Item>
					</Card.Root>
				{/each}
			</Accordion.Root>
		{:else}
			<div class="text-center py-8">
				<p class="text-muted-foreground">
					Transparansi nilai akan dibagikan pada saat semua unit praktikum telah diselesaikan
				</p>
			</div>
		{/if}
	</div>
</div>
