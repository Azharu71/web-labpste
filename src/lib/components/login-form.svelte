<script lang="ts">
	import logo from '$lib/assets/logo-pste.webp';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn, type WithElementRef } from '$lib/utils';
	import { enhance } from '$app/forms';
	import Loading from '$lib/components/loading.svelte';

	let showPassword = $state(false);
	let isLoading = $state(false);

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

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
		<div class="flex flex-col gap-6">
			<div class="flex flex-col items-center gap-2">
				<a href="/" class="flex flex-col items-center gap-2 font-medium">
					<div class="flex items-center justify-center rounded-md">
						<img src={logo} alt="Laboratorium PSTE" class="w-32" />
					</div>
				</a>
				<h2 class="text-xl font-bold">Laboratorium PSTE Untirta</h2>
				<div class="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
					Bagi yang sebelumnya mendaftar menggunakan akun @student<span class="font-bold">
						s
					</span>.untirta.ac.id , silahkan gunakan email dengan format
					<span class="font-bold"> @student.untirta.ac.id </span>
					untuk melakukan login/reset password
				</div>
				<div class="text-center text-sm">
					Belum punya akun?
					<a href="/auth/register" class="underline underline-offset-4"> Daftar </a>
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<Label for="email-{id}">Email</Label>
					<Input name="email" id="email-{id}" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-3">
					<div class="flex items-center justify-between">
						<Label for="password-{id}">Password</Label>
						<a
							href="/auth/resetpassword"
							class="text-sm text-primary underline-offset-4 hover:underline"
						>
							Lupa password?
						</a>
					</div>
					<Input
						name="password"
						id="password-{id}"
						type={showPassword ? 'text' : 'password'}
						placeholder="Masukkan password"
						required
					/>
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							id="show-password-{id}"
							bind:checked={showPassword}
							class="h-4 w-4"
						/>
						<Label for="show-password-{id}" class="text-sm font-normal text-muted-foreground"
							>Tampilkan password</Label
						>
					</div>
				</div>
				<Button type="submit" class="w-full" disabled={isLoading}>
					{#if isLoading}
						<Loading variant="inline" message="Sedang memproses..." />
					{:else}
						Masuk
					{/if}
				</Button>
			</div>
			<div
				class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
			></div>
		</div>
	</form>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
	>
		Copyright &copy; 2026 Lab. PSTE Untirta
	</div>
</div>
