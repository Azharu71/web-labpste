<script lang="ts">
	import logo from '$lib/assets/logo-pste.webp';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import Loading from '$lib/components/loading.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isLoading = $state(false);
	let showNewPassword = $state(false);
</script>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-sm">
		<div class="flex flex-col gap-6">
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
				<div class="flex flex-col gap-6">
					<!-- Header -->
					<div class="flex flex-col items-center gap-2">
						<a href="/" class="flex flex-col items-center gap-2 font-medium">
							<div class="flex items-center justify-center rounded-md">
								<img src={logo} alt="Laboratorium PSTE" class="w-32" />
							</div>
						</a>
						<h2 class="text-xl font-bold">
							{data.mode === 'request' ? 'Lupa Password' : 'Buat Password Baru'}
						</h2>
						<p class="text-center text-sm text-muted-foreground">
							{data.mode === 'request'
								? 'Insert your email to receive a reset password link.'
								: 'Insert your new password for your account.'}
						</p>
					</div>

					<!-- Error exchange code (link expired / invalid) -->
					{#if data.exchangeError}
						<div class="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
							Link reset is not valid or has expired. Please request again.
						</div>
					{/if}

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
								<Loading variant="inline" message="Sending..." />
							{:else}
								Reset Password
							{/if}
						</Button>

						<!-- ── Mode: Update Password ──────────────────────────── -->
					{:else}
						<div class="flex flex-col gap-4">
							<div class="grid gap-3">
								<Label for="newPassword">New Password</Label>
								<Input
									name="newPassword"
									id="newPassword"
									type={showNewPassword ? 'text' : 'password'}
									placeholder="Insert your new password"
									required
								/>
							</div>

							<div class="grid gap-3">
								<Label for="confirmPassword">Confirm Password</Label>
								<Input
									name="confirmPassword"
									id="confirmPassword"
									type={showNewPassword ? 'text' : 'password'}
									placeholder="Confirm new password"
									required
								/>
								<div class="flex items-center gap-2">
									<input
										type="checkbox"
										id="show-confirm-password"
										bind:checked={showNewPassword}
										class="h-4 w-4"
									/>
									<Label
										for="show-confirm-password"
										class="text-sm font-normal text-muted-foreground"
									>
										Show password
									</Label>
								</div>
							</div>

							<Button type="submit" class="w-full" disabled={isLoading}>
								{#if isLoading}
									<Loading variant="inline" message="Saving..." />
								{:else}
									Save New Password
								{/if}
							</Button>
						</div>
					{/if}

					<!-- Back to login -->
					<div class="text-center text-sm">
						<a href="/auth/login" class="text-blue-500 underline-offset-4 hover:underline">
							Back to login page
						</a>
					</div>
				</div>
			</form>

			<div class="text-muted-foreground text-balance text-center text-xs">
				Copyright &copy; 2026 Lab. PSTE Untirta
			</div>
		</div>
	</div>
</div>
