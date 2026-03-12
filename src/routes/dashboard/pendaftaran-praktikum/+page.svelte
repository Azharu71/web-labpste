<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import labkom from '$lib/assets/labkom.webp';
	import labdasel from '$lib/assets/labdasel.webp';
	import labkendali from '$lib/assets/labkendali.webp';
	import labtelkom from '$lib/assets/labtelkom.webp';
	import labtenaga from '$lib/assets/labtenaga.webp';

	let { data }: { data: PageData } = $props();
	const userData = data.userData;

	// Perbaikan: Menggunakan path absolut untuk memastikan routing dinamis [labId] terbaca dengan benar.
	// Pastikan slug (misal: 'lab_dasel') sesuai dengan key di 'labNameMap' pada server.ts
	const labs = [
		{
			name: 'Lab. Dasar Elektro',
			desc: 'Teknik Digital, Dasar Elektronika, Pengukuran Listrik',
			href: '/dashboard/pendaftaran-praktikum/lab_dasel',
			icon: labdasel
		},
		{
			name: 'Lab. Tenaga',
			desc: 'Rangkaian Listrik, Elektronika Daya, Mesin Listrik',
			href: '/dashboard/pendaftaran-praktikum/lab_tenaga',
			icon: labtenaga
		},
		{
			name: 'Lab. Kendali',
			desc: 'Dasar Sistem Kendali, Instrumentasi dan Kendali, Sistem Kendali Digital',
			href: '/dashboard/pendaftaran-praktikum/lab_kendali',
			icon: labkendali
		},
		{
			name: 'Lab. Telekomunikasi',
			desc: 'Dasar Telekomunikasi, Antena dan Propagasi.',
			href: '/dashboard/pendaftaran-praktikum/lab_telkom',
			icon: labtelkom
		},
		{
			name: 'Lab. Komputer',
			desc: 'Komputasi Numerik, Pengolahan Sinyal Digital',
			href: '/dashboard/pendaftaran-praktikum/lab_kom',
			icon: labkom
		}
	];
</script>

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
				<Breadcrumb.Page>Pendaftaran Praktikum</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</header>

<div class="flex flex-1 flex-col gap-6 p-6 pt-0">
	<div class="flex flex-col gap-1">
		<h1 class="text-3xl font-bold tracking-tight">Pendaftaran Praktikum</h1>
		<p class="text-muted-foreground">
			Pilih laboratorium untuk melakukan pendaftaran ulang praktikum.
		</p>
	</div>
	<Card.Root class="border-destructive/50 bg-destructive/10">
		<Card.Header>
			<Card.Description class="text-destructive/80">
				Mohon maaf, pendaftaran praktikum periode saat ini telah ditutup.
			</Card.Description>
		</Card.Header>
	</Card.Root>

	{#if false}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each labs as lab}
				<Card.Root class="flex flex-col justify-around transition-all hover:shadow-md">
					<Card.Header>
						<div class="mb-4 flex w-full items-center justify-center">
							<img src={lab.icon} alt={lab.name} class="h-16 w-16 md:h-20 md:w-20" />
						</div>
						<Card.Title>{lab.name}</Card.Title>
						<Card.Description>{lab.desc}</Card.Description>
					</Card.Header>
					<Card.Footer>
						<Button class="w-full" href={lab.href}>Daftar Sekarang</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
