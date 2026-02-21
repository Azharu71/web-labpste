<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import FlaskConicalIcon from '@lucide/svelte/icons/flask-conical';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import UsersIcon from '@lucide/svelte/icons/users';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import AwardIcon from '@lucide/svelte/icons/award';
	import IconWhite from '$lib/assets/icon-pste-white.webp';
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
	<!-- Navigation Header -->
	<nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<a href="/" class="flex items-center space-x-3">
					<div class="p-2 bg-blue-600 rounded-lg">
						<img src={IconWhite} alt="Icon" class="w-6" />
					</div>
					<div>
						<h1 class="text-xl font-bold text-gray-900">Lab. PSTE</h1>
					</div>
				</a>
				<div class="flex items-center space-x-3">
					<Button variant="ghost" href="/auth/login">Masuk</Button>
					<Button href="/auth/register">Daftar</Button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative overflow-hidden">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
			<div class="text-center">
				<!-- <Badge variant="secondary" class="mb-6">
					<FlaskConicalIcon class="h-4 w-4 mr-2" />
					Manajemen Praktikum
				</Badge> -->
				<h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
					Laboratorium<br />
					<span
						class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-5xl"
					>
						Program Studi Teknik Elektro
					</span>
				</h1>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
					Platform digital untuk mengelola praktikum, nilai, dan laporan mahasiswa Program Studi
					Teknik Elektro. Akses mudah, transparan, dan efisien untuk pembelajaran yang lebih baik.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<Button size="lg" href="/auth/login" class="text-lg px-8 py-3">
						<UsersIcon class="h-5 w-5 mr-2" />
						Masuk ke Sistem
					</Button>
					<Button size="lg" variant="outline" href="/auth/register" class="text-lg px-8 py-3">
						<GraduationCapIcon class="h-5 w-5 mr-2" />
						Daftar Akun Baru
					</Button>
				</div>
			</div>
		</div>

		<!-- Background Decoration -->
		<div class="absolute inset-0 -z-10 overflow-hidden">
			<div
				class="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
			></div>
			<div
				class="absolute top-40 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"
			></div>
			<div
				class="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"
			></div>
		</div>
	</section>

	<!-- Features Section -->
	{#if false}
		<section class="py-24 bg-white/50">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
					<p class="text-lg text-gray-600 max-w-2xl mx-auto">
						Dirancang khusus untuk memudahkan pengelolaan praktikum dan meningkatkan pengalaman
						belajar mahasiswa
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<!-- Feature 1 -->
					<Card.Root class="transition-all hover:shadow-lg hover:-translate-y-1">
						<Card.Header>
							<div class="p-3 bg-blue-100 rounded-lg w-fit mb-4">
								<BookOpenIcon class="h-6 w-6 text-blue-600" />
							</div>
							<Card.Title class="text-xl">Manajemen Nilai</Card.Title>
							<Card.Description>
								Kelola dan pantau nilai praktikum per unit dengan sistem yang transparan dan mudah
								diakses
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<!-- Feature 2 -->
					<Card.Root class="transition-all hover:shadow-lg hover:-translate-y-1">
						<Card.Header>
							<div class="p-3 bg-green-100 rounded-lg w-fit mb-4">
								<FlaskConicalIcon class="h-6 w-6 text-green-600" />
							</div>
							<Card.Title class="text-xl">Praktikum Digital</Card.Title>
							<Card.Description>
								Akses materi praktikum, submit laporan, dan ikuti jadwal praktikum dalam satu
								platform
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<!-- Feature 3 -->
					<Card.Root class="transition-all hover:shadow-lg hover:-translate-y-1">
						<Card.Header>
							<div class="p-3 bg-purple-100 rounded-lg w-fit mb-4">
								<AwardIcon class="h-6 w-6 text-purple-600" />
							</div>
							<Card.Title class="text-xl">Transparansi Nilai</Card.Title>
							<Card.Description>
								Lihat detail nilai per unit, grade akhir, dan progress pembelajaran secara real-time
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<!-- Feature 4 -->
					<Card.Root class="transition-all hover:shadow-lg hover:-translate-y-1">
						<Card.Header>
							<div class="p-3 bg-orange-100 rounded-lg w-fit mb-4">
								<UsersIcon class="h-6 w-6 text-orange-600" />
							</div>
							<Card.Title class="text-xl">Role-Based Access</Card.Title>
							<Card.Description>
								Sistem akses yang disesuaikan untuk admin, dosen, dan mahasiswa dengan hak akses
								yang tepat
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<!-- Feature 5 -->
					<Card.Root class="transition-all hover:shadow-lg hover:-translate-y-1">
						<Card.Header>
							<div class="p-3 bg-red-100 rounded-lg w-fit mb-4">
								<GraduationCapIcon class="h-6 w-6 text-red-600" />
							</div>
							<Card.Title class="text-xl">Dashboard Mahasiswa</Card.Title>
							<Card.Description>
								Dashboard personal untuk melihat progress, ranking, dan statistik pembelajaran
							</Card.Description>
						</Card.Header>
					</Card.Root>

					<!-- Feature 6 -->
					<Card.Root class="transition-all hover:shadow-lg hover:-translate-y-1">
						<Card.Header>
							<div class="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
								<ZapIcon class="h-6 w-6 text-indigo-600" />
							</div>
							<Card.Title class="text-xl">Responsif & Modern</Card.Title>
							<Card.Description>
								Interface modern yang responsive dan dapat diakses dari berbagai perangkat
							</Card.Description>
						</Card.Header>
					</Card.Root>
				</div>
			</div>
		</section>
	{/if}

	<!-- CTA Section -->
	<section class="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
		<div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
				Siap Memulai Praktikum Digital?
			</h2>
			<p class="text-xl text-blue-100 mb-8">
				Bergabunglah dengan sistem manajemen praktikum modern untuk pengalaman belajar yang lebih
				baik
			</p>
			{#if false}
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<Button size="lg" variant="secondary" href="/auth/register" class="text-lg px-8 py-3">
						<GraduationCapIcon class="h-5 w-5 mr-2" />
						Daftar Sekarang
					</Button>
					<Button
						size="lg"
						variant="outline"
						href="/auth/login"
						class="text-lg px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
					>
						<UsersIcon class="h-5 w-5 mr-2" />
						Masuk ke Akun
					</Button>
				</div>
			{/if}
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-gray-900 text-white py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<div class="flex items-center justify-center">
					<div>
						<h3 class="text-xl font-bold">Laboratorium Program Studi Teknik Elektro</h3>
					</div>
				</div>
				<div class="flex flex-col justify-center text-gray-400">
					<div class="flex flex-col justify-center text-gray-400 mb-3">
						<span>Fakultas Teknik</span>
						<span>Universitas Sultan Ageng Tirtayasa</span>
					</div>
					<span class="text-sm">Copyright &copy; 2026 Lab. PSTE Untirta</span>
				</div>
			</div>
		</div>
	</footer>
</div>
