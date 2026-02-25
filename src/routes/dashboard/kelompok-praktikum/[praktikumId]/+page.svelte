<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="w-full overflow-hidden rounded-lg border">
	{#if data.spreadsheetUrl}
		<iframe
			src={data.spreadsheetUrl}
			class="w-full"
			style="height: 70vh; min-height: 400px;"
			frameborder="0"
			title="Jadwal Kelompok {data.praktikum.nama_praktikum}"
		></iframe>
	{:else}
		<div
			class="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3"
		>
			<p>Data jadwal dan kelompok belum tersedia</p>
		</div>
	{/if}
</div>
