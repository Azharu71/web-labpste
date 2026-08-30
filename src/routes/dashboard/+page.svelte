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
	const myPraktikums = data.myPraktikums || [];
	
	const labNameToId: Record<string, string> = {
		'Laboratorium Dasar Elektro': 'lab_dasel',
		'Laboratorium Tenaga': 'lab_tenaga',
		'Laboratorium Kendali': 'lab_kendali',
		'Laboratorium Telekomunikasi': 'lab_telkom',
		'Laboratorium Komputer': 'lab_kom'
	};
	// const bestPraktikan = data.bestPraktikan;

	// // Color palette for best praktikan cards
	// const cardColors = [
	// 	{ bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-l-yellow-500' },
	// 	{ bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-l-blue-500' },
	// 	{ bg: 'bg-green-500', text: 'text-green-600', border: 'border-l-green-500' },
	// 	{ bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-l-purple-500' },
	// 	{ bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-l-pink-500' },
	// 	{ bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-l-orange-500' },
	// 	{ bg: 'bg-teal-500', text: 'text-teal-600', border: 'border-l-teal-500' }
	// ];
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
			Dashboard Praktikum
		</h1>
	</div>

	<!-- Stats Cards (Single Card, Mobile Friendly) -->
	<Card.Root>
		<Card.Content class="p-6">
			<div class="grid gap-6 md:grid-cols-3">
				<div class="flex items-center gap-4 border-b pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
					<div class="rounded-full bg-primary/10 p-3">
						<GraduationCapIcon class="h-6 w-6 text-primary" />
					</div>
					<div>
						<p class="text-sm font-medium text-muted-foreground">Total Asisten</p>
						<h3 class="text-2xl font-bold">{stats.totalAsisten}</h3>
					</div>
				</div>
				<div class="flex items-center gap-4 border-b pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
					<div class="rounded-full bg-primary/10 p-3">
						<UsersIcon class="h-6 w-6 text-primary" />
					</div>
					<div>
						<p class="text-sm font-medium text-muted-foreground">Total Praktikan</p>
						<h3 class="text-2xl font-bold">{stats.totalPraktikan}</h3>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<div class="rounded-full bg-primary/10 p-3">
						<BookOpenIcon class="h-6 w-6 text-primary" />
					</div>
					<div>
						<p class="text-sm font-medium text-muted-foreground">Total Praktikum</p>
						<h3 class="text-2xl font-bold">{stats.totalPraktikum}</h3>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Praktikum Saya -->
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-xl">Praktikum Saya</Card.Title>
			<Card.Description>Daftar praktikum anda semester ini</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if myPraktikums.length > 0}
				<div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{#each myPraktikums as p}
						{@const labId = labNameToId[p.list_praktikum?.nama_lab] || 'lab_dasel'}
						{@const url = `/dashboard/pendaftaran-praktikum/${labId}/${p.praktikum_id}`}
						<a href={url} class="flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-all hover:shadow-md hover:border-primary">
							<div>
								<h4 class="font-semibold text-lg line-clamp-1">{p.list_praktikum?.nama_praktikum}</h4>
								<p class="text-sm text-muted-foreground mt-1">{p.list_praktikum?.nama_lab} </p>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<BookOpenIcon class="h-12 w-12 text-muted-foreground/30 mb-4" />
					<h3 class="text-lg font-medium">Belum ada Praktikum</h3>
					<p class="text-sm text-muted-foreground mt-2 max-w-[400px]">
						Anda belum terdaftar di praktikum manapun semester ini.
					</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-2">
				<TrophyIcon class="h-6 w-6 text-yellow-500" />
				<div>
					<Card.Title class="text-xl">Praktikan Terbaik</Card.Title>
					<Card.Description>
						Praktikan terbaik akan diumumkan pada saat semua unit praktikum telah selesai
					</Card.Description>
				</div>
			</div>
		</Card.Header>
		<!-- <Card.Content>
			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each bestPraktikan as praktikan, index}
					{@const color = cardColors[index % cardColors.length]}
					<div
						class={`flex items-center gap-3 rounded-lg border border-l-4 ${color.border} p-4 transition-all shadow-mdz`}
					>
						<Avatar.Root class="h-10 w-10 shrink-0">
							<Avatar.Fallback class={`text-sm font-bold text-white ${color.bg}`}>
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
							<p class={`text-xs font-medium ${color.text} mt-0.5`}>{praktikan.praktikum}</p>
						</div>
					</div>
				{/each}
			</div>
		</Card.Content> -->
	</Card.Root>
</div>
