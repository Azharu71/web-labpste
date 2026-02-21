<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { parseKrs, type AvailableSession } from '$lib/utils/krs-parser';
	import { toast } from 'svelte-sonner';

	let { data, form } = $props();

	const groupLinks: Record<string, string> = {
		komnum: 'https://chat.whatsapp.com/FXlQAotkg3t1ZfoLzm5onn?mode=gi_t',
		dasel: 'https://chat.whatsapp.com/C2IfVAMeWxoDEXo0nMvkuB?mode=gi_t',
		penglis: 'https://chat.whatsapp.com/FQnR9mzXMqVBweiN1stAup?mode=hq1tcla',
		meli: 'https://chat.whatsapp.com/EO0nsN40PVZ31YB1Bu9Uxl?mode=gi_t',
		dsk: 'https://chat.whatsapp.com/JGKeZPWraPDAU4xkbVt5u8?mode=gi_t',
		ik: 'https://chat.whatsapp.com/BGsivJ7Attg7Hd4IMuNeEt?mode=gi_t',
		skd: 'https://chat.whatsapp.com/F28c0Zbzu7tC547iyxyUGU?mode=gi_t'
	};

	let currentGroupLink = $derived(groupLinks[data.praktikumId]);

	const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
	const sessions = [
		{ id: 1, time: '08:00-10:00' },
		{ id: 2, time: '10:00-12:00' },
		{ id: 3, time: '13:00-15:00' },
		{ id: 4, time: '15:00-17:00' },
		{ id: 5, time: '17:00-19:00' }
	];

	let isLoading = $state(false);
	let isScanning = $state(false);
	let checkedSchedules = $state(new Set<string>());

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) return;

		const file = target.files[0];
		if (file.type !== 'application/pdf') {
			toast.error('Mohon upload file PDF');
			return;
		}

		isScanning = true;
		const toastId = toast.loading('Memindai jadwal dari KRS...');

		try {
			const availableSessions = await parseKrs(file);

			// Reset current checks
			checkedSchedules.clear();

			// Auto check available sessions
			availableSessions.forEach((session) => {
				checkedSchedules.add(`${session.day}_${session.sessionId}`);
			});

			// Trigger reactivity
			checkedSchedules = new Set(checkedSchedules);

			toast.success(`Berhasil memindai! Ditemukan ${availableSessions.length} jadwal kosong.`, {
				id: toastId
			});
		} catch (error) {
			console.error(error);
			toast.error('Gagal memindai PDF. Pastikan file KRS valid.', {
				id: toastId
			});
		} finally {
			isScanning = false;
		}
	}
</script>

<header class="flex h-16 shrink-0 items-center gap-2 px-4">
	<Sidebar.Trigger class="-ml-1" />
	<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
	<Breadcrumb.Root class="hidden md:block">
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/dashboard/pendaftaran-praktikum"
					>Pendaftaran Praktikum</Breadcrumb.Link
				>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/dashboard/pendaftaran-praktikum/{data.labId}"
					>{data.labId}</Breadcrumb.Link
				>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>{data.praktikumName}</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</header>
<div class="flex flex-1 flex-col gap-6 p-6 pt-0">
	<Card.Root>
		<Card.Header>
			<Card.Title>Pendaftaran praktikum: {data.praktikumName}</Card.Title>
			<Card.Description>Lengkapi data di bawah ini.</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if data.isRegistered}
				<div class="flex flex-col gap-4 bg-green-100 p-4 rounded text-green-800">
					<div>
						<strong>Sudah Terdaftar!</strong>
						<p>
							Anda sudah mendaftar di praktikum ini. Silahkan bergabung dengan grup praktikum untuk
							informasi lebih lanjut.
						</p>
					</div>
					{#if currentGroupLink}
						<Button class="w-fit" href={currentGroupLink} target="_blank">
							Gabung Grup Praktikum
						</Button>
					{:else}
						<p class="text-sm italic opacity-80">*Link grup belum tersedia untuk praktikum ini.</p>
					{/if}
				</div>
			{:else}
				{#if form?.message}
					<div
						class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					>
						<strong class="font-bold">Error!</strong>
						<span class="block sm:inline">{form.message}</span>
					</div>
				{/if}
				<form
					method="POST"
					enctype="multipart/form-data"
					use:enhance={() => {
						isLoading = true;
						return async ({ update }) => {
							isLoading = false;
							await update();
						};
					}}
					class="space-y-6"
				>
					<div class="grid md:grid-cols-2 gap-4">
						<div class="space-y-2">
							<Label>Nama Lengkap</Label>
							<Input name="fullName" required />
						</div>
						<div class="space-y-2">
							<Label>NIM</Label>
							<Input name="nim" required />
						</div>
						<div class="space-y-2 md:col-span-2">
							<Label>IPK</Label>
							<Input
								name="ipk"
								type="number"
								step="0.01"
								min="0"
								max="4.00"
								required
								placeholder="Contoh: 3.50"
							/>
						</div>
					</div>

					<div class="space-y-2">
						<Label>Upload KRS (PDF)</Label>
						<Input
							type="file"
							name="krsFile"
							required
							class="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-12"
							accept=".pdf"
							onchange={handleFileChange}
							disabled={isScanning}
						/>
						<p class="text-xs text-muted-foreground">
							Upload file KRS Anda untuk mengisi jadwal kosong secara otomatis.
						</p>
					</div>

					<div class="space-y-2">
						<Label>Jenis KRS</Label>
						<div class="flex gap-4">
							<label
								class="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-slate-50"
							>
								<input type="radio" name="krsType" value="regular" checked /> Reguler
							</label>
							<label
								class="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-slate-50"
							>
								<input type="radio" name="krsType" value="manual" /> Manual
							</label>
						</div>
					</div>

					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label>Jadwal Kosong</Label>

							{#if isScanning}
								<span class="text-xs text-blue-600 animate-pulse">Sedang memindai...</span>
							{/if}
						</div>
						<p class="text-xs text-muted-foreground">
							*Silahkan periksa kembali jadwal kosong yang dipilih agar sesuai dengan KRS anda.
						</p>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{#each days as day}
								<div class="rounded-lg border p-4 shadow-sm">
									<h3 class="mb-3 font-semibold text-primary">{day}</h3>
									<div class="flex flex-col gap-2">
										{#each sessions as session}
											{@const value = `${day}_${session.id}`}
											{@const isChecked = checkedSchedules.has(value)}
											<label
												class="flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm transition-all hover:bg-muted {isChecked
													? 'border-blue-500 bg-blue-50'
													: 'border-transparent bg-slate-50'}"
											>
												<div class="flex flex-col">
													<span class="font-medium">Shift {session.id}</span>
													<span class="text-xs text-muted-foreground">{session.time}</span>
												</div>
												<input
													type="checkbox"
													name="schedule"
													{value}
													class="hidden"
													checked={isChecked}
													onchange={(e) => {
														if (e.currentTarget.checked) checkedSchedules.add(value);
														else checkedSchedules.delete(value);
														checkedSchedules = new Set(checkedSchedules);
													}}
												/>
												{#if isChecked}
													<span
														class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white"
													>
														✓
													</span>
												{/if}
											</label>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>

					<Button type="submit" class="w-full" disabled={isLoading}>
						{#if isLoading}
							Memproses...
						{:else}
							Daftar Sekarang
						{/if}
					</Button>
				</form>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
