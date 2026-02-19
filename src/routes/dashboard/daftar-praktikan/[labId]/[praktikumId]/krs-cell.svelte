<script lang="ts">
	interface Props {
		url: string | null;
	}
	let { url }: Props = $props();
</script>

{#if !url}
	<span>-</span>
{:else}
	<a href={url} target="_blank" class="text-blue-500 hover:underline">Lihat</a>
{/if}
