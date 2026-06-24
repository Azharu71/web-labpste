<script lang="ts">
	import logo from '$lib/assets/logo-pste.webp';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn, type WithElementRef } from '$lib/utils';
	import { enhance } from '$app/forms';
	import Loading from '$lib/components/loading.svelte';

	let isLoading = $state(false);
	let showPassword = $state(false);

	let {
		ref = $bindable(null),
		class: className,
		form,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { form?: any } = $props();

	const id = $props.id();
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form
		method="POST"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				isLoading = false;
			};
		}}
	>
		<div class="flex flex-col gap-6 border-2 p-8 rounded-2xl">
			<div class="flex flex-col items-center gap-2">
				<a href="/" class="flex flex-col items-center gap-2 font-medium">
					<div class="flex items-center justify-center rounded-md">
						<img src={logo} alt="Laboratorium PSTE" class="w-32" />
					</div>
				</a>
				<h2 class="text-xl font-bold">Laboratorium PSTE Untirta</h2>
				<div class="text-center text-sm">
					Sudah punya akun?
					<a href="/auth/login" class="underline underline-offset-4"> Masuk </a>
				</div>
			</div>
			{#if form?.error}
				<div class="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
					{form.error}
				</div>
			{/if}
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<Label for="nim-{id}">NIM</Label>
					<Input
						id="nim-{id}"
						name="nim"
						type="text"
						placeholder="3332xxxxxx"
						value={form?.nim || ''}
						required
					/>
				</div>
				<div class="grid gap-3">
					<Label for="email-{id}">Email</Label>
					<Input
						id="email-{id}"
						name="email"
						type="email"
						placeholder="333xx@example.com"
						value={form?.email || ''}
						required
					/>
					<p class="text-muted-foreground text-sm">*Disarankan menggunakan email untirta!</p>
				</div>
				<div class="grid gap-3">
					<Label for="password-{id}">Password</Label>
					<Input
						id="password-{id}"
						name="password"
						type={showPassword ? 'text' : 'password'}
						placeholder="Masukkan password"
						required
						min="8"
					/>
				</div>
				<div class="grid gap-3">
					<Label for="confirmPassword-{id}">Konfirmasi Password</Label>
					<Input
						id="confirmPassword-{id}"
						name="confirmPassword"
						type={showPassword ? 'text' : 'password'}
						placeholder="Masukkan ulang password"
						required
					/>
				</div>
				<div class="flex items-center gap-2">
					<input
						type="checkbox"
						id="show-password-{id}"
						bind:checked={showPassword}
						class="h-4 w-4"
					/>
					<Label for="show-password-{id}" class="text-sm font-normal text-muted-foreground">
						Tampilkan password
					</Label>
				</div>

				<Button type="submit" class="w-full" disabled={isLoading}>
					{#if isLoading}
						<Loading variant="inline" message="Sedang memproses..." />
					{:else}
						Daftar
					{/if}
				</Button>
			</div>
			<div
				class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
			></div>
			<div
				class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
			>
				Copyright &copy; 2026 Lab. PSTE Untirta
			</div>
		</div>
	</form>
</div>
