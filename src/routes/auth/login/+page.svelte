<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import type { ActionData } from './$types';
	import { page } from '$app/state';

	let { form }: { form: ActionData } = $props();

	const resetSuccess = $derived(page.url.searchParams.get('reset') === 'success');
	const registeredSuccess = $derived(page.url.searchParams.get('registered') === 'success');
</script>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-md">
		{#if resetSuccess}
			<div class="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
				Password berhasil direset! Silakan masuk dengan password baru Anda.
			</div>
		{/if}
		{#if registeredSuccess}
			<div class="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
				Pendaftaran akun berhasil! Silakan masuk menggunakan akun baru Anda.
			</div>
		{/if}
		<LoginForm {form} />
	</div>
</div>
