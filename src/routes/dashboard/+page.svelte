<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import UsersIcon from '@lucide/svelte/icons/users';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';

	let { data }: { data: PageData } = $props();

	const userData = data.userData;
	const stats = data.stats;
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
			Dashboard Laboratorium Program Studi Teknik Elektro - Semester Genap 2026/2027
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
				<Card.Title class="text-sm font-medium">Total Praktikum Semester Genap</Card.Title>
				<BookOpenIcon class="h-4 w-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{stats.totalPraktikum}</div>
				<p class="text-xs text-muted-foreground">Mata kuliah praktikum</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Top Students Section -->

	<!-- Quick Actions or Additional Info (Role-based) -->
	<!-- {#if userData.role === 'Asisten'}
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
		</div> -->
</div>
