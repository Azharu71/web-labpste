<script lang="ts">
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Mengambil data dari load function (+page.server.ts) dan layout
	const { userData, labName, praktikum, labId } = data;

	const praktikumId = [
		{ nama: 'Dasar Elektronika', slug: 'dasel' },
		{ nama: 'Pengukuran Listrik', slug: 'penglis' },
		{ nama: 'Mesin Listrik', slug: 'meli' },
		{ nama: 'Dasar Sistem Kendali', slug: 'dsk' },
		{ nama: 'Instrumentasi Dan Kendali', slug: 'ik' },
		{ nama: 'Sistem Kendali Digital', slug: 'skd' },
		{ nama: 'Komputasi Numerik', slug: 'komnum' }
	];

	const praktikumList = praktikum.map((item) => {
		const matched = praktikumId.find((p) => p.nama === item.nama_praktikum);
		return {
			...item,
			slug: matched?.slug ?? ''
		};
	});
</script>

<Sidebar.Provider>
	<AppSidebar {userData} />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
			<Breadcrumb.Root class="hidden md:block">
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/dashboard/pendaftaran-praktikum"
							>Pendaftaran Praktikum</Breadcrumb.Link
						>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>{labName}</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>

		<div class="flex flex-1 flex-col gap-6 p-6 pt-0">
			<div class="flex flex-col gap-1">
				<h2 class="text-3xl font-bold tracking-tight">{labName}</h2>
				<p class="text-muted-foreground">
					Daftar praktikum yang tersedia untuk pendaftaran di {labName}.
				</p>
			</div>

			{#if praktikumList.length === 0}
				<div
					class="flex h-[200px] w-full items-center justify-center rounded-lg border border-dashed"
				>
					<p class="text-muted-foreground">Belum ada praktikum yang tersedia saat ini.</p>
				</div>
			{:else}
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each praktikumList as item}
						<Card.Root class="flex flex-col justify-between transition-all hover:shadow-sm">
							<Card.Header>
								<Card.Title>Praktikum {item.nama_praktikum}</Card.Title>
								<Card.Description>Semester {item.semester} - {item.tahun}</Card.Description>
							</Card.Header>
							<Card.Footer>
								<Button class="w-full" href="/dashboard/pendaftaran-praktikum/{labId}/{item.slug}"
									>Daftar</Button
								>
							</Card.Footer>
						</Card.Root>
					{/each}
				</div>
			{/if}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
