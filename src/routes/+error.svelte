<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ShieldXIcon from '@lucide/svelte/icons/shield-x';
	import HomeIcon from '@lucide/svelte/icons/home';
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
			>
				<ShieldXIcon class="h-8 w-8 text-destructive" />
			</div>
			<Card.Title class="text-2xl">{$page.status}</Card.Title>
			<Card.Description>
				{#if $page.status === 403}
					Kamu tidak punya akses ke halaman ini. Hubungi asisten jika kamu merasa ini adalah
					kesalahan.
				{:else if $page.status === 404}
					Halaman yang kamu cari tidak ditemukan.
				{:else}
					Terjadi kesalahan: {$page.error?.message || 'Error tidak diketahui'}
				{/if}
			</Card.Description>
		</Card.Header>
		<Card.Content class="text-center">
			<Button href="/dashboard" class="w-full mt-4">Kembali ke Dashboard</Button>
		</Card.Content>
	</Card.Root>
</div>
