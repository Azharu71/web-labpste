<script lang="ts">
	import type { PageData } from './$types';
	import  Info from '@lucide/svelte/icons/info'

	let { data }: { data: PageData } = $props();
</script>

<div class="w-full overflow-hidden rounded-lg border">
	{#if data.spreadsheetUrl}
		<div class="w-full overflow-x-auto" style="-webkit-overflow-scrolling: touch;">
			<iframe
				src={data.spreadsheetUrl}
				class="block h-[70vh] min-h-[400px] w-full border-none"
				frameborder="0"
				title="Jadwal Kelompok {data.praktikum.nama_praktikum}"
			></iframe>
		</div>
	{:else}
		<div
			class="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3 rounded-lg border border-dashed border-border"
		>
			<Info class="size-12 opacity-50" />
			<p>Data jadwal dan kelompok untuk praktikum <span class="font-semibold">{data.praktikum.nama_praktikum}</span> belum tersedia.</p>
		</div>
	{/if}
</div>
