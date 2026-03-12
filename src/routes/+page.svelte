<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import IconWhite from '$lib/assets/icon-pste-white.webp';
	import IconColour from '$lib/assets/icon-pste.webp';
</script>

<div class="min-h-screen bg-background">
	<!-- Navigation -->
	<nav class="bg-sidebar border-b border-sidebar-border sticky top-0 z-50">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-14">
				<a href="/" class="flex items-center gap-2.5 min-w-0">
					<div class="flex items-center justify-center w-8 h-8 bg-primary rounded-md shrink-0">
						<img src={IconWhite} alt="Lab PSTE" class="w-5 h-5 object-contain" />
					</div>
					<span class="text-sm font-semibold text-foreground tracking-tight truncate"
						>Lab. PSTE</span
					>
				</a>
				<div class="flex items-center gap-1.5 shrink-0 ml-3">
					<Button variant="ghost" size="sm" href="/auth/login" class="px-3">Masuk</Button>
					<Button size="sm" href="/auth/register" class="px-3">Daftar</Button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero -->
	<section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28">
		<div class="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
			<!-- Left: Text -->
			<div>
				<!-- Mobile-only logo: appear above text on small screens -->
				<div class="flex justify-center mb-8 lg:hidden">
					<div class="relative">
						<div class="absolute inset-0 rounded-full bg-primary/8 scale-125"></div>
						<div class="flex items-center justify-center w-32 h-32 rounded-full bg-primary/10">
							<img
								src={IconColour}
								alt="Laboratorium PSTE Untirta"
								class="w-20 h-20 object-contain"
							/>
						</div>
					</div>
				</div>

				<p
					class="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide sm:tracking-widest mb-3 sm:mb-4"
				>
					Universitas Sultan Ageng Tirtayasa
				</p>
				<h1
					class="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 sm:mb-5"
				>
					Laboratorium<br />
					<span class="text-primary">Teknik Elektro</span>
				</h1>
				<p class="text-muted-foreground leading-relaxed mb-7 sm:mb-8 max-w-md text-sm sm:text-base">
					Platform digital untuk mengelola praktikum, nilai, dan laporan mahasiswa Program Studi
					Teknik Elektro. Akses mudah, transparan, dan efisien.
				</p>
				<div class="flex flex-col sm:flex-row gap-3">
					<Button size="lg" href="/auth/login" class="px-7 w-full sm:w-auto">
						Masuk ke Sistem
					</Button>
					<Button size="lg" variant="outline" href="/auth/register" class="px-7 w-full sm:w-auto">
						Daftar Akun Baru
					</Button>
				</div>
			</div>

			<!-- Right: Visual identity — desktop only -->
			<div class="hidden lg:flex items-center justify-center">
				<div class="relative">
					<div class="absolute inset-0 rounded-full bg-primary/8 scale-125"></div>
					<div class="absolute inset-0 rounded-full bg-primary/5 scale-150"></div>
					<div
						class="relative flex items-center justify-center w-64 h-64 rounded-full bg-primary/10"
					>
						<img
							src={IconColour}
							alt="Laboratorium PSTE Untirta"
							class="w-40 h-40 object-contain"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Divider -->
	<div class="border-t border-border"></div>

	<!-- Features strip -->
	<section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
		<div class="grid sm:grid-cols-3 gap-8 sm:gap-10">
			<div class="flex sm:block gap-4 sm:gap-0">
				<div
					class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mb-0 sm:mb-4"
				>
					<svg
						class="w-5 h-5 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<div>
					<h3 class="font-semibold text-foreground mb-1 sm:mt-0">Manajemen Nilai</h3>
					<p class="text-sm text-muted-foreground leading-relaxed">
						Kelola dan pantau nilai praktikum setiap unit secara transparan dan terstruktur.
					</p>
				</div>
			</div>
			<div class="flex sm:block gap-4 sm:gap-0">
				<div
					class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mb-0 sm:mb-4"
				>
					<svg
						class="w-5 h-5 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				</div>
				<div>
					<h3 class="font-semibold text-foreground mb-1">Modul Praktikum</h3>
					<p class="text-sm text-muted-foreground leading-relaxed">
						Akses materi dan modul praktikum digital langsung dari platform dalam satu tempat.
					</p>
				</div>
			</div>
			<div class="flex sm:block gap-4 sm:gap-0">
				<div
					class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mb-0 sm:mb-4"
				>
					<svg
						class="w-5 h-5 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</div>
				<div>
					<h3 class="font-semibold text-foreground mb-1">Kelompok &amp; Jadwal</h3>
					<p class="text-sm text-muted-foreground leading-relaxed">
						Pantau pembagian kelompok dan jadwal praktikum yang telah ditentukan asisten.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Divider -->
	<div class="border-t border-border"></div>

	<!-- Footer -->
	<footer class="bg-sidebar border-t border-sidebar-border py-10">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<div
				class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-center sm:text-left"
			>
				<div>
					<h3 class="font-semibold text-foreground text-sm mb-1">
						Laboratorium Program Studi Teknik Elektro
					</h3>
					<p class="text-xs text-muted-foreground">
						Fakultas Teknik — Universitas Sultan Ageng Tirtayasa
					</p>
					<p class="text-xs text-muted-foreground mt-3">Copyright &copy; 2026 Lab. PSTE Untirta</p>
				</div>
			</div>
		</div>
	</footer>
</div>
