<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import type { ActionData } from './$types';
	import { page } from '$app/stores';

	let { form }: { form: ActionData } = $props();
</script>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-sm">
		{#if form?.error}
			<div class="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
				{form.error}
			</div>
		{/if}
		{#if $page.url.searchParams.get('registered') === 'true'}
			<div class="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-600 border border-green-200">
				Registrasi berhasil. Silakan login.
			</div>
		{/if}
		<LoginForm />
	</div>
</div>
