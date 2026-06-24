<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import icon from '$lib/assets/icon-pste.webp';

	let { children } = $props();
</script>

<svelte:head>
	<title>Laboratorium PSTE</title>
	<link rel="icon" href={icon} />
</svelte:head>

<ModeWatcher defaultMode="light" />
<Toaster />
{@render children?.()}
