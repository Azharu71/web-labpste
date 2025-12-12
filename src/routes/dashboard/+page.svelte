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
	const stats = data.stats;
	const bestPraktikan = data.bestPraktikan;
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
			<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
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
			</div>

			<!-- Top Students Section -->
			<Card.Root>
				<Card.Header>
					<div class="flex items-center gap-2">
						<TrophyIcon class="h-6 w-6 text-yellow-500" />
						<div>
							<Card.Title class="text-xl">Praktikan Terbaik</Card.Title>
							<Card.Description>
								Praktikan dengan performa terbaik dari masing-masing praktikum semester Ganjil 2025/2026
							</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-4 md:grid-cols-3">
					{#each bestPraktikan as praktikan, index}
						<div class="relative">
							<!-- Badge -->
							<div class="absolute -top-2 -right-2 z-10">
								<Badge class={`text-white ${
									index === 0 ? 'bg-yellow-500 hover:bg-yellow-600' :
									index === 1 ? 'bg-blue-500 hover:bg-blue-600' :
									index === 2 ? 'bg-green-500 hover:bg-green-600' :
									index === 3 ? 'bg-purple-500 hover:bg-purple-600' :
									index === 4 ? 'bg-pink-500 hover:bg-pink-600' :
									'bg-orange-500 hover:bg-orange-600'
								}`}>
									<MedalIcon class="h-5 w-5" />
								</Badge>
							</div>

							<!-- praktikan Card -->
							<Card.Root class={`transition-all hover:shadow-lg ${
								index === 0 ? 'ring-2 ring-yellow-500/30 bg-gradient-to-br from-yellow-50 to-white' :
								index === 1 ? 'ring-2 ring-blue-500/30 bg-gradient-to-br from-blue-50 to-white' :
								index === 2 ? 'ring-2 ring-green-500/30 bg-gradient-to-br from-green-50 to-white' :
								index === 3 ? 'ring-2 ring-purple-500/30 bg-gradient-to-br from-purple-50 to-white' :
								index === 4 ? 'ring-2 ring-pink-500/30 bg-gradient-to-br from-pink-50 to-white' :
								'ring-2 ring-orange-500/30 bg-gradient-to-br from-orange-50 to-white'
							}`}>
								<Card.Content class="pt-6">
									<div class="flex flex-col items-center text-center space-y-4">
										<!-- Avatar -->
										<Avatar.Root class="h-16 w-16">
											<Avatar.Fallback class={`text-lg font-bold text-white ${
												index === 0 ? 'bg-yellow-500' :
												index === 1 ? 'bg-blue-500' :
												index === 2 ? 'bg-green-500' :
												index === 3 ? 'bg-purple-500' :
												index === 4 ? 'bg-pink-500' :
												'bg-orange-500'
											}`}>
												{praktikan.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
											</Avatar.Fallback>
										</Avatar.Root>

										<!-- praktikan Info -->
											<div class="space-y-2">
												<h3 class="font-semibold text-sm leading-tight">
													{praktikan.name}
												</h3>
												<p class="text-xs text-muted-foreground">
													{praktikan.nim}
												</p>
											</div>

										<!-- Subject -->
										<div class="text-center">
											<p class="text-xs text-muted-foreground">
												{praktikan.praktikum}
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
