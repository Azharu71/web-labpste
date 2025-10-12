<script lang="ts">
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';

	import AwardIcon from '@lucide/svelte/icons/award';
	import MegaphoneIcon from '@lucide/svelte/icons/megaphone';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import UserCheckIcon from '@lucide/svelte/icons/user-check';
	import FileTextIcon from '@lucide/svelte/icons/file-text';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData } from './$types';

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
		list_praktikum: {
			id: string;
			nama_praktikum: string;
			nama_lab: string;
			semester: string;
		} | null;
	}

	let { data }: { data: PageData & { praktikumScores: PraktikumScore[] } } = $props();

	// Data is now coming from layout server load - cached and optimized
	const userData = data.userData;
	const praktikumScores = data.praktikumScores || [];

	// Helper function to get unit scores
	function getUnitScores(score: PraktikumScore, unitNumber: number) {
		const praktikum = score[`praktikum_u${unitNumber}` as keyof PraktikumScore] as number | null;
		const laporan = score[`laporan_u${unitNumber}` as keyof PraktikumScore] as number | null;
		const total = score[`total_nilai_u${unitNumber}` as keyof PraktikumScore] as number | null;

		return {
			praktikum: praktikum?.toFixed(2) || '-',
			laporan: laporan?.toFixed(2) || '-',
			total: total?.toFixed(2) || '-'
		};
	}
</script>

<Sidebar.Provider>
	<AppSidebar {userData} />
	<Sidebar.Inset>
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
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div class="flex flex-col gap-1 pb-4">
				<h2 class="text-2xl font-semibold tracking-tight">Transparansi Nilai Praktikum</h2>
				<p class="text-muted-foreground">
					Transparansi Nilai Praktikum Laboratorium Program Studi Teknik Elektro
				</p>
			</div>
			<div class="flex items-center gap-4">
				<Avatar.Root class="h-16 w-16">
					<Avatar.Fallback>
						{praktikumScores[0]?.nama ? praktikumScores[0]?.nama.substring(0, 2).toUpperCase() : 'UN'}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="grid gap-1">
					<p class="text-lg font-semibold leading-none">
						{praktikumScores[0]?.nama?.toUpperCase() || 'NAMA TIDAK TERSEDIA'}
					</p>
					<p class="text-sm text-muted-foreground">
						{userData.nim || 'NIM tidak tersedia'}
					</p>
				</div>
			</div>
			<div>
				{#if praktikumScores.length > 0}
					<Accordion.Root type="single">
						{#each praktikumScores as scoreData, index}
							<Accordion.Item value="item-{index + 1}">
								<Accordion.Trigger class="text-base">
									{scoreData.list_praktikum?.nama_praktikum ||
										`Praktikum ${scoreData.praktikum_id}`}
								</Accordion.Trigger>
								<Accordion.Content>
									<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
										<Card.Root>
											<Card.Header
												class="flex flex-row items-center justify-between space-y-0 pb-2"
											>
												<Card.Title class="text-sm font-medium">Sosialisasi</Card.Title>
												<MegaphoneIcon class="h-4 w-4 text-muted-foreground" />
											</Card.Header>
											<Card.Content>
												<div class="text-2xl font-bold">
													{scoreData.sosialisasi?.toFixed(2) || '-'}
												</div>
											</Card.Content>
										</Card.Root>

										<Card.Root>
											<Card.Header
												class="flex flex-row items-center justify-between space-y-0 pb-2"
											>
												<Card.Title class="text-sm font-medium">Responsi</Card.Title>
												<CheckCircleIcon class="h-4 w-4 text-muted-foreground" />
											</Card.Header>
											<Card.Content>
												<div class="text-2xl font-bold">
													{scoreData.responsi?.toFixed(2) || '-'}
												</div>
											</Card.Content>
										</Card.Root>

										<Card.Root>
											<Card.Header
												class="flex flex-row items-center justify-between space-y-0 pb-2"
											>
												<Card.Title class="text-sm font-medium">Absolut</Card.Title>
												<UserCheckIcon class="h-4 w-4 text-muted-foreground" />
											</Card.Header>
											<Card.Content>
												<div class="text-2xl font-bold">
													{scoreData.absolut?.toFixed(2) || '-'}
												</div>
											</Card.Content>
										</Card.Root>

										<Card.Root>
											<Card.Header
												class="flex flex-row items-center justify-between space-y-0 pb-2"
											>
												<Card.Title class="text-sm font-medium">Grade</Card.Title>
												<AwardIcon class="h-4 w-4 text-muted-foreground" />
											</Card.Header>
											<Card.Content>
												<div
													class="text-2xl font-bold {scoreData.grade === 'A'
														? 'text-green-600'
														: scoreData.grade === 'B'
															? 'text-blue-600'
															: scoreData.grade === 'C'
																? 'text-yellow-600'
																: scoreData.grade === 'D'
																	? 'text-orange-600'
																	: scoreData.grade === 'E'
																		? 'text-red-600'
																		: ''}"
												>
													{scoreData.grade || '-'}
												</div>
											</Card.Content>
										</Card.Root>
									</div>

									<Separator class="my-6" />

									<div>
										<h3 class="text-sm font-semibold mb-4">Rincian Nilai Praktikum</h3>
										<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
											{#each Array(8) as _, unitIndex}
												{@const unitNumber = unitIndex + 1}
												{@const unitScores = getUnitScores(scoreData, unitNumber)}
												{#if unitScores.praktikum !== '-' || unitScores.laporan !== '-' || unitScores.total !== '-'}
													<Card.Root>
														<div
															class="px-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
														>
															<div class="flex items-center gap-3">
																<FileTextIcon class="h-7 w-7 text-primary" />
																<div>
																	<p class="font-semibold">Unit {unitNumber}</p>
																</div>
															</div>

															<div
																class="grid grid-cols-3 gap-4 text-center md:w-auto md:min-w-[240px]"
															>
																<div>
																	<p class="text-xs font-medium text-muted-foreground">PRAKTIKUM</p>
																	<p class="font-semibold">{unitScores.praktikum}</p>
																</div>
																<div>
																	<p class="text-xs font-medium text-muted-foreground">LAPORAN</p>
																	<p class="font-semibold">{unitScores.laporan}</p>
																</div>
																<div>
																	<p class="text-xs font-bold text-primary">TOTAL</p>
																	<p class="text-xl font-bold text-primary">{unitScores.total}</p>
																</div>
															</div>
														</div>
													</Card.Root>
												{/if}
											{/each}
										</div>
									</div>
								</Accordion.Content>
							</Accordion.Item>
						{/each}
					</Accordion.Root>
				{:else}
					<div class="text-center py-8">
						<p class="text-muted-foreground">Tidak ada data nilai praktikum yang tersedia.</p>
					</div>
				{/if}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
