<script lang="ts">
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	type Variant = 'page' | 'inline' | 'overlay';

	let {
		message = 'Memuat data...',
		variant = 'page' as Variant
	}: {
		message?: string;
		variant?: Variant;
	} = $props();
</script>

{#if variant === 'overlay'}
	<!-- Full overlay di atas konten yang sudah ada -->
	<div
		class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm"
	>
		<LoaderCircle class="size-8 animate-spin text-primary" />
		{#if message}
			<p class="text-sm text-muted-foreground">{message}</p>
		{/if}
	</div>
{:else if variant === 'inline'}
	<!-- Inline kecil, cocok di dalam card/section -->
	<div class="flex items-center gap-2 text-muted-foreground">
		<LoaderCircle class="size-4 animate-spin" />
		{#if message}
			<span class="text-sm">{message}</span>
		{/if}
	</div>
{:else}
	<!-- Default: centered di area konten halaman -->
	<div class="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
		<LoaderCircle class="size-10 animate-spin text-primary" />
		{#if message}
			<p class="text-sm">{message}</p>
		{/if}
	</div>
{/if}
