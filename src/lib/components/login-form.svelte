<script lang="ts">
	import logo from '$lib/assets/logo-pste.webp';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn, type WithElementRef } from '$lib/utils';
	import { enhance } from '$app/forms';
	import Loading from '$lib/components/loading.svelte';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';

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
		<div class="flex flex-col gap-6 border-2 p-8 rounded-2xl">
			<div class="flex flex-col items-center gap-2">
				<a href="/" class="flex flex-col items-center gap-2 font-medium">
					<div class="flex items-center justify-center rounded-md">
						<img src={logo} alt="Laboratorium PSTE" class="w-32" />
					</div>
				</a>
				<h2 class="text-xl font-bold">Laboratorium PSTE Untirta</h2>
				<div class="text-center text-sm">
					Belum punya akun?
					<a href="/auth/register" class="underline underline-offset-4"> Daftar </a>
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<Label for="email-{id}">Email</Label>
					<Input
						name="email"
						id="email-{id}"
						type="email"
						placeholder="333xx@example.com"
						required
					/>
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
					<div class="relative">
						<Input
							name="password"
							id="password-{id}"
							type={showPassword ? 'text' : 'password'}
							placeholder="Masukkan password"
							required
							class="pr-10"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOffIcon class="h-5 w-5" />
							{:else}
								<EyeIcon class="h-5 w-5" />
							{/if}
						</button>
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
			<div
				class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
			>
				Copyright &copy; 2026 Lab. PSTE Untirta
			</div>
		</div>
	</form>
</div>
