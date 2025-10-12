<script lang="ts">
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData } from './$types';

	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	
	import TrophyIcon from '@lucide/svelte/icons/trophy';
	import MedalIcon from '@lucide/svelte/icons/medal';
	import UsersIcon from '@lucide/svelte/icons/users';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';

	let { data }: { data: PageData } = $props();

	const userData = data.userData;

	const topStudents = [
		{
			rank: 1,
			nim: '3332220001',
			name: 'Muhammad Rizki Nugraha',
			grade: 'A',
			score: 95.5,
			praktikum: 'Pengolahan Sinyal Digital'
		},
		{
			rank: 2,
			nim: '3332220002', 
			name: 'Siti Nurhaliza Putri',
			grade: 'A',
			score: 94.2,
			praktikum: 'Sistem Kendali'
		},
		{
			rank: 3,
			nim: '3332220003',
			name: 'Ahmad Fadhil Rahman',
			grade: 'A',
			score: 93.8,
			praktikum: 'Elektronika Daya'
		}
	];

	const stats = {
		totalAsisten: 28,
		totalPraktikan: 500,
		totalPraktikum: 8,
		completionRate: 92
	};
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
							<Breadcrumb.Page>Home</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-6 p-4 pt-0">
			<!-- Welcome Section -->
			<div class="flex flex-col gap-2">
				<h1 class="text-3xl font-bold tracking-tight">
					Selamat Datang, {userData.role === 'Asisten' ? 'Asisten' : 'Praktikan'}!
				</h1>
				<p class="text-muted-foreground">
					Dashboard Laboratorium Program Studi Teknik Elektro - Semester Ganjil 2025/2026
				</p>
			</div>

			<!-- Stats Cards -->
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Total Asisten</Card.Title>
						<GraduationCapIcon class="h-4 w-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{stats.totalAsisten}</div>
						<p class="text-xs text-muted-foreground">Asisten aktif semester ini</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Total Praktikan</Card.Title>
						<UsersIcon class="h-4 w-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{stats.totalPraktikan}</div>
						<p class="text-xs text-muted-foreground">Praktikan terdaftar</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Total Praktikum</Card.Title>
						<BookOpenIcon class="h-4 w-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{stats.totalPraktikum}</div>
						<p class="text-xs text-muted-foreground">Mata kuliah praktikum</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Tingkat Kelulusan</Card.Title>
						<TrophyIcon class="h-4 w-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{stats.completionRate}%</div>
						<p class="text-xs text-muted-foreground">Rata-rata kelulusan</p>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Top 3 Students Section -->
			<Card.Root>
				<Card.Header>
					<div class="flex items-center gap-2">
						<TrophyIcon class="h-6 w-6 text-yellow-500" />
						<div>
							<Card.Title class="text-xl">Top 3 Praktikan Terbaik</Card.Title>
							<Card.Description>
								Praktikan dengan performa terbaik semester Ganjil 2025/2026
							</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-4 md:grid-cols-3">
						{#each topStudents as student}
							<div class="relative">
								<!-- Rank Badge -->
								<div class="absolute -top-2 -right-2 z-10">
									{#if student.rank === 1}
										<Badge class="bg-yellow-500 text-white hover:bg-yellow-600">
											<TrophyIcon class="h-3 w-3 mr-1" />
											#{student.rank}
										</Badge>
									{:else if student.rank === 2}
										<Badge class="bg-gray-400 text-white hover:bg-gray-500">
											<MedalIcon class="h-3 w-3 mr-1" />
											#{student.rank}
										</Badge>
									{:else}
										<Badge class="bg-amber-600 text-white hover:bg-amber-700">
											<MedalIcon class="h-3 w-3 mr-1" />
											#{student.rank}
										</Badge>
									{/if}
								</div>

								<!-- Student Card -->
								<Card.Root class={`transition-all hover:shadow-lg ${
									student.rank === 1 ? 'ring-2 ring-yellow-500/20 bg-gradient-to-br from-yellow-50 to-white' :
									student.rank === 2 ? 'ring-2 ring-gray-400/20 bg-gradient-to-br from-gray-50 to-white' :
									'ring-2 ring-amber-600/20 bg-gradient-to-br from-amber-50 to-white'
								}`}>
									<Card.Content class="pt-6">
										<div class="flex flex-col items-center text-center space-y-4">
											<!-- Avatar -->
											<Avatar.Root class="h-16 w-16">
												<Avatar.Fallback class={`text-lg font-bold ${
													student.rank === 1 ? 'bg-yellow-500 text-white' :
													student.rank === 2 ? 'bg-gray-400 text-white' :
													'bg-amber-600 text-white'
												}`}>
													{student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
												</Avatar.Fallback>
											</Avatar.Root>

											<!-- Student Info -->
											<div class="space-y-2">
												<h3 class="font-semibold text-sm leading-tight">
													{student.name}
												</h3>
												<p class="text-xs text-muted-foreground">
													{student.nim}
												</p>
											</div>

											<!-- Score and Grade -->
											<div class="flex flex-col items-center space-y-2">
												<div class="text-2xl font-bold text-primary">
													{student.score}
												</div>
												<Badge variant="secondary" class="text-xs">
													Grade {student.grade}
												</Badge>
											</div>

											<!-- Subject -->
											<div class="text-center">
												<p class="text-xs text-muted-foreground">
													{student.praktikum}
												</p>
											</div>
										</div>
									</Card.Content>
								</Card.Root>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Quick Actions or Additional Info (Role-based) -->
			{#if userData.role === 'Asisten'}
				<Card.Root>
					<Card.Header>
						<Card.Title>Aksi Cepat</Card.Title>
						<Card.Description>Kelola data praktikum dan nilai dengan mudah</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="grid gap-4 md:grid-cols-2">
							<a href="/dashboard/praktikum" class="block">
								<Card.Root class="transition-all hover:shadow-md hover:scale-105 cursor-pointer">
									<Card.Content class="flex items-center space-x-4">
										<BookOpenIcon class="h-8 w-8 text-primary" />
										<div>
											<p class="font-medium">Kelola Praktikum</p>
											<p class="text-sm text-muted-foreground">Tambah, edit, dan kelola mata kuliah praktikum</p>
										</div>
									</Card.Content>
								</Card.Root>
							</a>
							<a href="/dashboard/nilai-praktikum" class="block">
								<Card.Root class="transition-all hover:shadow-md hover:scale-105 cursor-pointer">
									<Card.Content class="flex items-center space-x-4">
										<GraduationCapIcon class="h-8 w-8 text-primary" />
										<div>
											<p class="font-medium">Kelola Nilai</p>
											<p class="text-sm text-muted-foreground">Input dan kelola nilai praktikan</p>
										</div>
									</Card.Content>
								</Card.Root>
							</a>
						</div>
					</Card.Content>
				</Card.Root>
			{:else}
				<Card.Root>
					<Card.Header>
						<Card.Title>Informasi Praktikan</Card.Title>
						<Card.Description>Informasi penting untuk praktikan</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							<div class="flex items-start space-x-3">
								<div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
								<div>
									<p class="font-medium">Cek Nilai Praktikum</p>
									<p class="text-sm text-muted-foreground">
										Lihat nilai dan transparansi praktikum Anda di menu Transparansi Nilai
									</p>
								</div>
							</div>
							<div class="flex items-start space-x-3">
								<div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
								<div>
									<p class="font-medium">Jadwal Praktikum</p>
									<p class="text-sm text-muted-foreground">
										Pastikan hadir tepat waktu sesuai jadwal yang telah ditentukan
									</p>
								</div>
							</div>
							<div class="flex items-start space-x-3">
								<div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
								<div>
									<p class="font-medium">Kontak Asisten</p>
									<p class="text-sm text-muted-foreground">
										Hubungi asisten jika ada pertanyaan terkait praktikum
									</p>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
