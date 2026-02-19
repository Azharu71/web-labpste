<script lang="ts">
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const userData = data.userData; // Assuming layout passes this, or we need to fetch it. wait, layout usually handles userData.
	// Actually, in the server load we didn't return userData, but the parent layout usually provides it.
	// However, for consistency with the previous page, let's assume layout load provides it to page data via +layout.server.ts
	// In many sveltekit apps, data inherits from layout.
	// Let's check the previous file: +page.svelte used data.userData.
	// And +page.server.ts in the reference `pendaftaran-praktikum` returned userData from parent().
	// The server file I just wrote for `[labId]` doesn't return userData explicitly, but standard SvelteKit merges parent data.
	// So `data.userData` should be available if +layout.server.ts returns it.
</script>

<Sidebar.Provider>
	<AppSidebar userData={data.userData} />
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
						<Breadcrumb.Link href="/dashboard/daftar-praktikan">Daftar Praktikan</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>{data.labName}</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>

		<div class="flex flex-1 flex-col gap-6 p-6 pt-0">
			<div class="flex flex-col gap-1">
				<h2 class="text-3xl font-bold tracking-tight">{data.labName}</h2>
				<p class="text-muted-foreground">Pilih praktikum untuk melihat daftar praktikan.</p>
			</div>

			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.praktikum as item}
					<Card.Root class="flex flex-col justify-between transition-all hover:shadow-md">
						<Card.Header>
							<Card.Title>{item.nama_praktikum}</Card.Title>
							<Card.Description>Semester {item.semester} {item.tahun}</Card.Description>
						</Card.Header>
						<Card.Footer>
							<Button class="w-full" href="/dashboard/daftar-praktikan/{data.labId}/{item.id}"
								>Lihat Daftar</Button
							>
						</Card.Footer>
					</Card.Root>
				{:else}
					<div class="col-span-full text-center text-muted-foreground">
						Belum ada praktikum yang tersedia untuk lab ini.
					</div>
				{/each}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
