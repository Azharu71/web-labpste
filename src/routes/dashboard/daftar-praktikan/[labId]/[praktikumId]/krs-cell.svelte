<script lang="ts">
	interface Props {
		url: string | null;
	}
	let { url }: Props = $props();
</script>

{#if !url}
	<span>-</span>
{:else}
	<a href={url} target="_blank" aria-label="Lihat KRS Mahasiswa" class="text-primary hover:underline">Lihat</a>
{/if}
