<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import UsersIcon from '@lucide/svelte/icons/users';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import TrophyIcon from '@lucide/svelte/icons/trophy';

	let { data }: { data: PageData } = $props();

	const userData = data.userData;
	const stats = data.stats;
	const bestPraktikan = data.bestPraktikan;

	// Color palette for best praktikan cards
	const cardColors = [
		{ bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-l-yellow-500' },
		{ bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-l-blue-500' },
		{ bg: 'bg-green-500', text: 'text-green-600', border: 'border-l-green-500' },
		{ bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-l-purple-500' },
		{ bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-l-pink-500' },
		{ bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-l-orange-500' },
		{ bg: 'bg-teal-500', text: 'text-teal-600', border: 'border-l-teal-500' }
	];
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
					<Breadcrumb.Page>Dashboard</Breadcrumb.Page>
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
			Dashboard Laboratorium Program Studi Teknik Elektro - Semester Genap 2026/2027
		</p>
	</div>

	<!-- Stats Section -->
	<div class="grid gap-6 lg:grid-cols-3 border border-border bg-card rounded-xl p-6 divide-y lg:divide-y-0 lg:divide-x divide-border">
		<!-- Stat 1 -->
		<div class="flex items-center gap-4 py-4 lg:py-0 lg:px-6 first:pl-0">
			<div class="text-primary bg-primary/8 rounded-lg p-2.5 shrink-0">
				<GraduationCapIcon class="h-6 w-6" />
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Asisten</p>
				<div class="flex items-baseline gap-1.5 mt-1">
					<span class="text-3xl font-bold font-mono tracking-tight">{stats.totalAsisten}</span>
					<span class="text-xs text-muted-foreground">asisten aktif</span>
				</div>
			</div>
		</div>

		<!-- Stat 2 -->
		<div class="flex items-center gap-4 py-4 lg:py-0 lg:px-6">
			<div class="text-chart-3 bg-chart-3/10 rounded-lg p-2.5 shrink-0">
				<UsersIcon class="h-6 w-6" />
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Praktikan</p>
				<div class="flex items-baseline gap-1.5 mt-1">
					<span class="text-3xl font-bold font-mono tracking-tight">{stats.totalPraktikan}</span>
					<span class="text-xs text-muted-foreground">praktikan terdaftar</span>
				</div>
			</div>
		</div>

		<!-- Stat 3 -->
		<div class="flex items-center gap-4 py-4 lg:py-0 lg:px-6 last:pr-0">
			<div class="text-chart-4 bg-chart-4/10 rounded-lg p-2.5 shrink-0">
				<BookOpenIcon class="h-6 w-6" />
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Praktikum</p>
				<div class="flex items-baseline gap-1.5 mt-1">
					<span class="text-3xl font-bold font-mono tracking-tight">{stats.totalPraktikum}</span>
					<span class="text-xs text-muted-foreground">mata kuliah</span>
				</div>
			</div>
		</div>
	</div>

	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-2">
				<TrophyIcon class="h-6 w-6 text-yellow-500" />
				<div>
					<Card.Title class="text-xl">Praktikan Terbaik</Card.Title>
					<Card.Description>
						Praktikan dengan performa terbaik dari masing-masing praktikum semester Genap 2026/2027
					</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each bestPraktikan as praktikan, index}
					{@const color = cardColors[index % cardColors.length]}
					<div
						class="flex items-center gap-3 rounded-lg border border-l-4 {color.border} p-4 transition-all shadow-md"
					>
						<Avatar.Root class="h-10 w-10 shrink-0">
							<Avatar.Fallback class="text-sm font-bold text-white {color.bg}">
								{praktikan.name
									.split(' ')
									.map((n: string) => n[0])
									.join('')
									.substring(0, 2)}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="min-w-0">
							<h3 class="text-sm font-semibold truncate">{praktikan.name}</h3>
							<p class="text-xs text-muted-foreground">{praktikan.nim}</p>
							<p class="text-xs font-medium {color.text} mt-0.5">{praktikan.praktikum}</p>
						</div>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</div>
