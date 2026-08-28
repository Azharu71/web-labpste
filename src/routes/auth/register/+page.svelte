<script lang="ts">
	import RegisterForm from '$lib/components/register-form.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-md">	
		<RegisterForm {form} />
	</div>
</div>
