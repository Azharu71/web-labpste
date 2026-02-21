<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';

	import Construction from '@lucide/svelte/icons/construction';
	let {
		data
	}: {
		data: {
			userData: {
				nim: string | undefined | null;
				email: string | undefined | null;
				role: string | null;
			};
		};
	} = $props();
</script>

<header
	class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
>
	<div class="flex items-center gap-2 px-4">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
		<Breadcrumb.Root class="hidden md:block">
			<Breadcrumb.List>
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class="hidden md:block" />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Kelompok Praktikum</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>
<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex flex-col gap-1">
		<h2 class="text-3xl font-bold tracking-tight">Daftar Kelompok dan Jadwal</h2>
		<p class="text-muted-foreground">
			Daftar Keseluruhan Kelompok dan Jadwal Praktikum Laboratorium Program Studi Teknik Elektro
		</p>
	</div>
	<div class="text-center py-8">
		<Construction class="mx-auto mb-4 size-12 text-muted-foreground" />
		<p class="text-muted-foreground">Halaman ini masih dalam tahap pengembangan</p>
	</div>
</div>
