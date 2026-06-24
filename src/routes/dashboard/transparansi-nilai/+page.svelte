<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	import AwardIcon from '@lucide/svelte/icons/award';
	import MegaphoneIcon from '@lucide/svelte/icons/megaphone';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import UserCheckIcon from '@lucide/svelte/icons/user-check';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import SearchIcon from '@lucide/svelte/icons/search';
	import UsersRoundIcon from '@lucide/svelte/icons/users-round';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData } from './$types';
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

	interface ListPraktikum {
		id: string;
		nama_praktikum: string;
		nama_lab: string;
		semester: string;
	}

	let {
		data
	}: {
		data: PageData & {
			praktikumScores: PraktikumScore[];
			allScores: PraktikumScore[];
			listPraktikum: ListPraktikum[];
		};
	} = $props();

	// [DISABLED] Upload nilai feature disabled - no longer needed
	// let isUploading = $state(false);
	// let selectedPraktikumId = $state('');
	//
	// let showMessage = $state(false);
	// let messageTimeout: ReturnType<typeof setTimeout>;
	//
	// $effect(() => {
	// 	if (form) {
	// 		showMessage = true;
	// 		clearTimeout(messageTimeout);
	// 		messageTimeout = setTimeout(() => (showMessage = false), 5000);
	// 	}
	// });

	const praktikumScores = data.praktikumScores || [];
	const units = [1, 2, 3, 4, 5, 6, 7, 8];
	const isAsisten = data.userData.role === 'Asisten';

	// Asisten: semua data nilai + list praktikum
	const allScores: PraktikumScore[] = data.allScores || [];
	const listPraktikum: ListPraktikum[] = data.listPraktikum || [];

	// Filter & search state untuk view Asisten
	let filterPraktikumId = $state('');
	let searchQuery = $state('');
	let expandedRow = $state<number | null>(null);

	// Derived: filtered scores
	let filteredScores = $derived.by(() => {
		let result = allScores;
		if (filterPraktikumId) {
			result = result.filter((s) => s.praktikum_id === filterPraktikumId);
		}
		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			result = result.filter(
				(s) => s.nim?.toLowerCase().includes(q) || s.nama?.toLowerCase().includes(q)
			);
		}
		return result;
	});

	function toggleRow(id: number) {
		expandedRow = expandedRow === id ? null : id;
	}

	function getPraktikumInfo(scoreData: PraktikumScore) {
		const praktikum = Array.isArray(scoreData.list_praktikum)
			? scoreData.list_praktikum[0]
			: scoreData.list_praktikum;
		return praktikum;
	}

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

	// Grade colour for letter-grade badges (A, B+, etc.)
	function getGradeStyle(grade: string | null) {
		switch (grade) {
			case 'A':
				return { color: 'text-emerald-700', bgColor: 'bg-emerald-50', variant: 'default' as const };
			case 'A-':
				return { color: 'text-emerald-600', bgColor: 'bg-emerald-50', variant: 'default' as const };
			case 'B+':
				return { color: 'text-blue-700', bgColor: 'bg-blue-50', variant: 'secondary' as const };
			case 'B':
				return { color: 'text-blue-600', bgColor: 'bg-blue-50', variant: 'secondary' as const };
			case 'B-':
				return { color: 'text-blue-500', bgColor: 'bg-blue-50', variant: 'secondary' as const };
			case 'C+':
				return { color: 'text-amber-600', bgColor: 'bg-amber-50', variant: 'outline' as const };
			case 'C':
				return { color: 'text-amber-700', bgColor: 'bg-amber-50', variant: 'outline' as const };
			case 'C-':
				return { color: 'text-orange-600', bgColor: 'bg-orange-50', variant: 'outline' as const };
			case 'D':
				return { color: 'text-orange-700', bgColor: 'bg-orange-50', variant: 'destructive' as const };
			case 'E':
				return { color: 'text-red-700', bgColor: 'bg-red-50', variant: 'destructive' as const };
			default:
				return { color: 'text-muted-foreground', bgColor: 'bg-muted', variant: 'secondary' as const };
		}
	}

	// Score colour for numeric unit scores (0–100 scale)
	function getScoreStyle(scoreStr: string) {
		const score = parseFloat(scoreStr);
		if (isNaN(score)) return 'text-muted-foreground';
		if (score >= 80) return 'text-emerald-700';
		if (score >= 65) return 'text-blue-700';
		if (score >= 55) return 'text-amber-700';
		return 'text-red-700';
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
	<!-- Page header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-bold tracking-tight">Transparansi Nilai Praktikum</h1>
		<p class="text-muted-foreground">
			Lihat detail nilai dan progress praktikum Anda secara transparan
		</p>
	</div>	{#if isAsisten}
		{#if allScores.length > 0}
			<!-- Asisten: Tabel Semua Nilai -->
			<Card.Root class="p-6">
				<Card.Header>
					<div class="flex items-center gap-3">
						<div class="p-2 rounded-lg bg-primary/10">
							<UsersRoundIcon class="h-5 w-5 text-primary" />
						</div>
						<div>
							<Card.Title class="text-xl font-bold">Daftar Nilai Semua Praktikan</Card.Title>
							<Card.Description>{allScores.length} data nilai dari seluruh praktikan</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<!-- Filter & Search -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div class="flex flex-col gap-1">
							<label for="filter-praktikum" class="text-sm font-medium">Filter Praktikum</label>
							<select
								id="filter-praktikum"
								bind:value={filterPraktikumId}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								<option value="">Semua Praktikum</option>
								{#each listPraktikum as prak (prak.id)}
									<option value={prak.id}>{prak.nama_praktikum}</option>
								{/each}
							</select>
						</div>
						<div class="flex flex-col gap-1">
							<label for="search-nilai" class="text-sm font-medium">Cari Praktikan</label>
							<div class="relative">
								<SearchIcon
									class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
								/>
								<input
									id="search-nilai"
									type="text"
									placeholder="Cari berdasarkan NIM atau Nama..."
									bind:value={searchQuery}
									class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								/>
							</div>
						</div>
					</div>

					<!-- Result Count -->
					<div class="flex items-center justify-between mb-4">
						<Badge variant="secondary">
							{filteredScores.length} hasil
						</Badge>
					</div>

					<!-- Data Table -->
					{#if filteredScores.length > 0}
						<div class="rounded-md border overflow-x-auto">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b bg-muted/50">
										<th class="px-4 py-3 text-left font-medium w-12">No</th>
										<th class="px-4 py-3 text-left font-medium">NIM</th>
										<th class="px-4 py-3 text-left font-medium">Nama</th>
										<th class="px-4 py-3 text-left font-medium">Praktikum</th>
										<th class="px-4 py-3 text-center font-medium">Sosialisasi</th>
										<th class="px-4 py-3 text-center font-medium">Responsi</th>
										<th class="px-4 py-3 text-center font-medium">Absolut</th>
										<th class="px-4 py-3 text-center font-medium">Grade</th>
										<th class="px-4 py-3 text-center font-medium w-12">Detail</th>
									</tr>
								</thead>
								<tbody>
									{#each filteredScores as scoreRow, idx (scoreRow.id)}
										{@const rowGradeStyle = getGradeStyle(scoreRow.grade)}
										{@const prakInfo = getPraktikumInfo(scoreRow)}
										<tr
											class="border-b hover:bg-muted/30 cursor-pointer transition-colors"
											onclick={() => toggleRow(scoreRow.id)}
										>
											<td class="px-4 py-3 text-muted-foreground">{idx + 1}</td>
											<td class="px-4 py-3 font-mono text-xs">{scoreRow.nim}</td>
											<td class="px-4 py-3 font-medium">{scoreRow.nama}</td>
											<td class="px-4 py-3 text-muted-foreground text-xs">
												{prakInfo?.nama_praktikum || scoreRow.praktikum_id}
											</td>
											<td class="px-4 py-3 text-center">{scoreRow.sosialisasi?.toFixed(2) || '-'}</td>
											<td class="px-4 py-3 text-center">{scoreRow.responsi?.toFixed(2) || '-'}</td>
											<td class="px-4 py-3 text-center font-semibold"
												>{scoreRow.absolut?.toFixed(2) || '-'}</td
											>
											<td class="px-4 py-3 text-center">
												{#if scoreRow.grade}
													<Badge
														class={rowGradeStyle.bgColor + ' ' + rowGradeStyle.color}
														variant={rowGradeStyle.variant}
													>
														{scoreRow.grade}
													</Badge>
												{:else}
													<span class="text-muted-foreground">-</span>
												{/if}
											</td>
											<td class="px-4 py-3 text-center">
												{#if expandedRow === scoreRow.id}
													<ChevronDownIcon class="h-4 w-4 mx-auto text-primary" />
												{:else}
													<ChevronRightIcon class="h-4 w-4 mx-auto text-muted-foreground" />
												{/if}
											</td>
										</tr>
										<!-- Expanded Detail Row -->
										{#if expandedRow === scoreRow.id}
											<tr>
												<td colspan="9" class="px-4 py-4 bg-muted/20">
													<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
														{#each units as unitNumber (unitNumber)}
															{@const us = getUnitScores(scoreRow, unitNumber)}
															<div class="rounded-lg border bg-background p-3 space-y-1">
																<div class="text-xs font-semibold text-primary">Unit {unitNumber}</div>
																<div class="flex justify-between text-xs">
																	<span class="text-muted-foreground">Praktikum</span>
																	<span class="font-medium">{us.praktikum}</span>
																</div>
																<div class="flex justify-between text-xs">
																	<span class="text-muted-foreground">Laporan</span>
																	<span class="font-medium">{us.laporan}</span>
																</div>
																<Separator />
																<div class="flex justify-between text-xs">
																	<span class="text-muted-foreground">Total</span>
																	<span class="font-bold">{us.total}</span>
																</div>
															</div>
														{/each}
													</div>
												</td>
											</tr>
										{/if}
									{/each}
								</tbody>
							</table>
						</div>
					{:else}
						<div class="text-center py-8">
							<SearchIcon class="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
							<p class="text-muted-foreground">Tidak ada data yang sesuai dengan filter</p>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{:else}
			<div class="text-center py-8">
				<p class="text-muted-foreground">Belum ada data nilai praktikum</p>
			</div>
		{/if}
	{:else}
		<!-- Student/Praktikan view: New polished Accordion Score list -->
		<div class="space-y-3">
			{#if praktikumScores.length > 0}
				<div class="flex items-center gap-2 mb-2">
					<BookOpenIcon class="h-5 w-5 text-primary" />
					<h2 class="text-base font-semibold">Detail Nilai Praktikum</h2>
					<Badge variant="secondary" class="ml-auto">{praktikumScores.length} Praktikum</Badge>
				</div>

				<Accordion.Root type="single" class="space-y-3">
					{#each praktikumScores as scoreData, index (scoreData.id)}
						{@const gradeStyle = getGradeStyle(scoreData.grade)}

						<Card.Root class="overflow-hidden transition-shadow hover:shadow-md">
							<Accordion.Item value="item-{index + 1}" class="border-none">

								<!-- Trigger: praktikum name + grade summary -->
								<Accordion.Trigger class="hover:no-underline px-5 py-4 hover:bg-muted/50">
									<div class="flex items-center justify-between w-full min-w-0">
										<div class="flex items-center gap-3 min-w-0">
											<div class="p-2 rounded-lg bg-primary/10 shrink-0">
												<BookOpenIcon class="h-4 w-4 text-primary" />
											</div>
											<div class="text-left min-w-0">
												<h3 class="font-semibold text-sm truncate">
													{getPraktikumInfo(scoreData)?.nama_praktikum ||
														`Praktikum ${scoreData.praktikum_id}`}
												</h3>
												<p class="text-xs text-muted-foreground truncate">
													{getPraktikumInfo(scoreData)?.nama_lab || 'Lab'} &bull;
													{getPraktikumInfo(scoreData)?.semester || 'Semester'}
												</p>
											</div>
										</div>
										<div class="flex items-center gap-2 shrink-0 ml-3">
											{#if scoreData.grade}
												<Badge
													class={gradeStyle.bgColor + ' ' + gradeStyle.color + ' font-bold'}
													variant={gradeStyle.variant}
												>
													{scoreData.grade}
												</Badge>
											{/if}
											{#if scoreData.absolut}
												<span class="text-sm font-bold text-primary tabular-nums">
													{scoreData.absolut?.toFixed(2)}
												</span>
											{/if}
										</div>
									</div>
								</Accordion.Trigger>

								<Accordion.Content class="px-5 pb-5">
									<!-- Summary row: 4 key scores as flat stat cells -->
									<div class="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-border rounded-lg overflow-hidden mb-5">
										<div class="px-4 py-3 border-r border-b sm:border-b-0 border-border">
											<p class="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
												<MegaphoneIcon class="h-3 w-3" /> Sosialisasi
											</p>
											<p class="text-xl font-bold tabular-nums">
												{scoreData.sosialisasi?.toFixed(2) || '–'}
											</p>
										</div>
										<div class="px-4 py-3 sm:border-r border-b sm:border-b-0 border-border">
											<p class="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
												<CheckCircleIcon class="h-3 w-3" /> Responsi
											</p>
											<p class="text-xl font-bold tabular-nums">
												{scoreData.responsi?.toFixed(2) || '–'}
											</p>
										</div>
										<div class="px-4 py-3 border-r border-border">
											<p class="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
												<UserCheckIcon class="h-3 w-3" /> Absolut
											</p>
											<p class="text-xl font-bold text-primary tabular-nums">
												{scoreData.absolut?.toFixed(2) || '–'}
											</p>
										</div>
										<div class="px-4 py-3">
											<p class="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
												<AwardIcon class="h-3 w-3" /> Grade Akhir
											</p>
											{#if scoreData.grade}
												<Badge
													class={gradeStyle.bgColor + ' ' + gradeStyle.color + ' text-base px-2 py-0.5'}
													variant={gradeStyle.variant}
												>
													{scoreData.grade}
												</Badge>
											{:else}
												<span class="text-xl font-bold text-muted-foreground">–</span>
											{/if}
										</div>
									</div>

									<!-- Unit scores: compact list rows instead of 8 nested cards -->
									<p class="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
										Detail Per Unit
									</p>
									<div class="border border-border rounded-lg overflow-hidden">
										{#each units as unitNumber (unitNumber)}
											{@const unitScores = getUnitScores(scoreData, unitNumber)}
											{#if unitScores.hasData}
												<div
													class="flex items-center gap-4 px-4 py-3 min-h-[44px] text-sm border-b border-border/60 last:border-b-0 odd:bg-muted/20"
												>
													<span class="w-12 text-xs font-semibold text-muted-foreground shrink-0">
														Unit {unitNumber}
													</span>
													<div class="flex flex-1 gap-4 text-xs">
														<span class="text-muted-foreground">
															Praktikum:
															<span class="font-medium text-foreground tabular-nums">
																{unitScores.praktikum}
															</span>
														</span>
														<span class="text-muted-foreground">
															Laporan:
															<span class="font-medium text-foreground tabular-nums">
																{unitScores.laporan}
															</span>
														</span>
													</div>
													<span
														class="{getScoreStyle(unitScores.total)} font-bold text-sm tabular-nums shrink-0"
													>
														{unitScores.total}
													</span>
												</div>
											{/if}
										{/each}
									</div>
								</Accordion.Content>

							</Accordion.Item>
						</Card.Root>
					{/each}
				</Accordion.Root>

			{:else}
				<!-- Empty state -->
				<div class="text-center py-16 px-4">
					<div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
						<BookOpenIcon class="h-5 w-5 text-muted-foreground" />
					</div>
					<p class="font-medium text-foreground mb-1">Nilai belum tersedia</p>
					<p class="text-sm text-muted-foreground max-w-sm mx-auto">
						Nilai akan ditampilkan setelah asisten mengisi data nilai praktikum. Hubungi asisten jika
						kamu sudah menyelesaikan semua unit.
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
