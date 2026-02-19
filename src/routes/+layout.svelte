<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import icon from '$lib/assets/icon-pste.webp';

	let { children } = $props();
</script>

<svelte:head>
	<title>Lab. PSTE</title>
	<link rel="icon" href={icon} />
</svelte:head>

<Toaster />
{@render children?.()}
