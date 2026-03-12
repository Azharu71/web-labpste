<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import UsersIcon from '@lucide/svelte/icons/users';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import NotebookPenIcon from '@lucide/svelte/icons/notebook-pen';
	import BriefcaseIcon from '@lucide/svelte/icons/briefcase-business';
	import UsersRoundIcon from '@lucide/svelte/icons/users-round';
	import BookTextIcon from '@lucide/svelte/icons/book-text';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

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
	<div class="grid gap-4 lg:grid-cols-3">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Asisten</Card.Title>
				<div class="rounded-md bg-primary/10 p-1.5">
					<GraduationCapIcon class="h-4 w-4 text-primary" />
				</div>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{stats.totalAsisten}</div>
				<p class="text-xs text-muted-foreground">Asisten aktif semester ini</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Praktikan</Card.Title>
				<div class="rounded-md bg-chart-3/15 p-1.5">
					<UsersIcon class="h-4 w-4 text-chart-3" />
				</div>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{stats.totalPraktikan}</div>
				<p class="text-xs text-muted-foreground">Praktikan terdaftar</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Praktikum</Card.Title>
				<div class="rounded-md bg-chart-4/15 p-1.5">
					<BookOpenIcon class="h-4 w-4 text-chart-4" />
				</div>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{stats.totalPraktikum}</div>
				<p class="text-xs text-muted-foreground">Mata kuliah semester ini</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Quick Links (role-based) -->
	{#if userData.role === 'Asisten'}
		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-sm">Aksi Cepat</Card.Title>
				<Card.Description class="text-xs">Kelola data praktikum dan nilai</Card.Description>
			</Card.Header>
			<Card.Content class="p-0">
				<div class="divide-y divide-border">
					<a
						href="/dashboard/praktikum"
						class="flex items-center gap-3 px-6 py-3 hover:bg-accent transition-colors group"
					>
						<div class="rounded-md bg-primary/10 p-1.5 shrink-0">
							<BriefcaseIcon class="h-4 w-4 text-primary" />
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium">Kelola Praktikum</p>
							<p class="text-xs text-muted-foreground">Tambah, edit, dan kelola mata kuliah praktikum</p>
						</div>
						<ChevronRightIcon class="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
					</a>
					<a
						href="/dashboard/nilai-praktikum"
						class="flex items-center gap-3 px-6 py-3 hover:bg-accent transition-colors group"
					>
						<div class="rounded-md bg-chart-3/15 p-1.5 shrink-0">
							<NotebookPenIcon class="h-4 w-4 text-chart-3" />
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium">Kelola Nilai</p>
							<p class="text-xs text-muted-foreground">Input dan kelola nilai praktikan</p>
						</div>
						<ChevronRightIcon class="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
					</a>
				</div>
			</Card.Content>
		</Card.Root>
	{:else}
		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-sm">Akses Cepat</Card.Title>
				<Card.Description class="text-xs">Halaman yang sering digunakan</Card.Description>
			</Card.Header>
			<Card.Content class="p-0">
				<div class="divide-y divide-border">
					<a
						href="/dashboard/transparansi-nilai"
						class="flex items-center gap-3 px-6 py-3 hover:bg-accent transition-colors group"
					>
						<div class="rounded-md bg-primary/10 p-1.5 shrink-0">
							<NotebookPenIcon class="h-4 w-4 text-primary" />
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium">Cek Nilai Praktikum</p>
							<p class="text-xs text-muted-foreground">Lihat nilai dan transparansi hasil praktikum Anda</p>
						</div>
						<ChevronRightIcon class="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
					</a>
					<a
						href="/dashboard/kelompok-praktikum"
						class="flex items-center gap-3 px-6 py-3 hover:bg-accent transition-colors group"
					>
						<div class="rounded-md bg-chart-4/15 p-1.5 shrink-0">
							<UsersRoundIcon class="h-4 w-4 text-chart-4" />
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium">Kelompok & Jadwal</p>
							<p class="text-xs text-muted-foreground">Lihat kelompok dan jadwal praktikum Anda</p>
						</div>
						<ChevronRightIcon class="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
					</a>
					<a
						href="/dashboard/modul-praktikum"
						class="flex items-center gap-3 px-6 py-3 hover:bg-accent transition-colors group"
					>
						<div class="rounded-md bg-chart-3/15 p-1.5 shrink-0">
							<BookTextIcon class="h-4 w-4 text-chart-3" />
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium">Modul Praktikum</p>
							<p class="text-xs text-muted-foreground">Akses materi dan modul praktikum digital</p>
						</div>
						<ChevronRightIcon class="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
					</a>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
