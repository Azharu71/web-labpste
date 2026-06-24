<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-3">
	{#if data.spreadsheetUrl}
		<h3 class="font-semibold text-lg text-foreground">{data.praktikum.nama_praktikum}</h3>
		<div class="w-full overflow-hidden sm:rounded-lg border-y sm:border border-border bg-card -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-x">
			<div class="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" style="-webkit-overflow-scrolling: touch;">
				<iframe
					src={data.spreadsheetUrl}
					class="block h-[80vh] sm:h-[70vh] min-h-[500px] sm:min-h-[400px] w-full border-none"
					frameborder="0"
					loading="lazy"
					title="Jadwal Kelompok {data.praktikum.nama_praktikum}"
				></iframe>
			</div>
		</div>
	{:else}
		<div
			class="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3 rounded-lg border border-dashed"
		>
			<p>Data jadwal dan kelompok belum tersedia untuk {data.praktikum.nama_praktikum}</p>
		</div>
	{/if}
</div>
