<script lang="ts">
	import logo from '$lib/assets/logo-pste.webp';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import Loading from '$lib/components/loading.svelte';
	import type { ActionData, PageData } from './$types';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isLoading = $state(false);
	let showNewPassword = $state(false);
</script>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-md">
		<form
			method="POST"
			action={data.mode === 'request' ? '?/requestReset' : '?/updatePassword'}
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					await update({ reset: false });
					isLoading = false;
				};
			}}
		>
			<div class="flex flex-col gap-6 border-2 p-8 rounded-2xl">
				<!-- Header -->
				<div class="flex flex-col items-center gap-2">
					<a href="/" class="flex flex-col items-center gap-2 font-medium">
						<div class="flex items-center justify-center rounded-md">
							<img src={logo} alt="Laboratorium PSTE" class="w-32" />
						</div>
					</a>
					<h2 class="text-xl font-bold">
						{data.mode === 'request' ? 'Lupa Password' : 'Buat password baru'}
					</h2>
					<p class="text-center text-sm text-muted-foreground">
						{data.mode === 'request'
							? 'Masukkan email Anda untuk menerima link reset password.'
							: 'Masukkan password baru untuk akun Anda.'}
					</p>
				</div>

				<!-- Error dari server action -->
				{#if form?.error}
					<div class="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
						{form.error}
					</div>
				{/if}

				<!-- Sukses kirim email -->
				{#if (form as { success?: boolean })?.success}
					<div class="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
						{(form as { message?: string }).message}
					</div>
				{/if}

				<!-- ── Mode: Request Reset ────────────────────────────── -->
				{#if data.mode === 'request'}
					<div class="flex flex-col gap-6">
						<div class="grid gap-3">
							<Label for="email">Email</Label>
							<Input
								name="email"
								id="email"
								type="email"
								placeholder="m@example.com"
								value={form?.email ?? ''}
								required
							/>
						</div>

						<Button type="submit" class="w-full" disabled={isLoading}>
							{#if isLoading}
								<Loading variant="inline" message="Mengirim..." />
							{:else}
								Reset Password
							{/if}
						</Button>

						<div class="text-center text-sm">
							<a href="/auth/login" class="text-blue-500 underline-offset-4 hover:underline">
								Kembali ke halaman login
							</a>
						</div>
					</div>

				<!-- ── Mode: Update Password ──────────────────────────── -->
				{:else}
					{#if 'code' in data}
						<input type="hidden" name="code" value={data.code} />
						<input type="hidden" name="tokenType" value={data.tokenType} />
					{/if}
					<div class="flex flex-col gap-4">
						<div class="grid gap-3">
							<Label for="newPassword">Password Baru</Label>
							<div class="relative">
								<Input
									name="newPassword"
									id="newPassword"
									type={showNewPassword ? 'text' : 'password'}
									placeholder="Masukkan password baru Anda"
									required
									class="pr-10"
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
									onclick={() => (showNewPassword = !showNewPassword)}
								>
									{#if showNewPassword}
										<EyeOffIcon class="h-5 w-5" />
									{:else}
										<EyeIcon class="h-5 w-5" />
									{/if}
								</button>
							</div>
						</div>

						<div class="grid gap-3">
							<Label for="confirmPassword">Konfirmasi Password</Label>
							<div class="relative">
								<Input
									name="confirmPassword"
									id="confirmPassword"
									type={showNewPassword ? 'text' : 'password'}
									placeholder="Konfirmasi password baru"
									required
									class="pr-10"
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
									onclick={() => (showNewPassword = !showNewPassword)}
								>
									{#if showNewPassword}
										<EyeOffIcon class="h-5 w-5" />
									{:else}
										<EyeIcon class="h-5 w-5" />
									{/if}
								</button>
							</div>
						</div>

						<Button type="submit" class="w-full" disabled={isLoading}>
							{#if isLoading}
								<Loading variant="inline" message="Menyimpan..." />
							{:else}
								Simpan Password Baru
							{/if}
						</Button>
					</div>
				{/if}
			</div>
		</form>
	</div>
</div>
