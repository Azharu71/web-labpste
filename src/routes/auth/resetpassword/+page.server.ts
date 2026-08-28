import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	resetPasswordRequestSchema,
	resetPasswordUpdateSchema
} from '$lib/schemas/auth';

// ─── Rate Limiter ────────────────────────────────────────────────────────────
// In-memory map: email → timestamp pengiriman terakhir
const resetCooldownMap = new Map<string, number>();
const COOLDOWN_SECONDS = 120;

function getRemainingCooldown(email: string): number {
	const lastSent = resetCooldownMap.get(email);
	if (!lastSent) return 0;
	const elapsed = Math.floor((Date.now() - lastSent) / 1000);
	return Math.max(0, COOLDOWN_SECONDS - elapsed);
}
// ─────────────────────────────────────────────────────────────────────────────

export const load: PageServerLoad = async ({ url }) => {
	// Memeriksa jenis token yang diberikan (PKCE atau Implicit OTP)
	const code = url.searchParams.get('code');
	const token_hash = url.searchParams.get('token_hash');

	if (code) {
		return { mode: 'update' as const, code, tokenType: 'pkce' };
	} else if (token_hash) {
		return { mode: 'update' as const, code: token_hash, tokenType: 'otp' };
	}

	return { mode: 'request' as const };
};

export const actions: Actions = {
	// Tahap 1: Kirim email reset password
	requestReset: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString()?.toLowerCase();

		// Validasi input
		const { error: validationError } = resetPasswordRequestSchema.validate({ email });
		if (validationError) {
			return fail(400, { email, error: validationError.details[0].message });
		}

		// Cek rate limit
		const secondsLeft = getRemainingCooldown(email!);
		if (secondsLeft > 0) {
			return fail(429, {
				email,
				error: `Untuk tujuan keamanan, Anda hanya dapat melakukan request ini setelah ${secondsLeft} detik.`,
				secondsLeft
			});
		}

		// Kirim email reset via Supabase
		const { error } = await supabase.auth.resetPasswordForEmail(email!, {
			redirectTo: `${url.origin}/auth/resetpassword`
		});

		if (error) {
			return fail(500, { email, error: error.message });
		}

		// Simpan timestamp pengiriman untuk rate limiting
		resetCooldownMap.set(email!, Date.now());

		return {
			success: true,
			message: 'Periksa email Anda jika terdaftar untuk mendapatkan link reset password.',
			secondsLeft: COOLDOWN_SECONDS
		};
	},

	// Tahap 2: Update password baru
	updatePassword: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();
		const newPassword = formData.get('newPassword')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();
		const code = formData.get('code')?.toString();
		const tokenType = formData.get('tokenType')?.toString();

		// Validasi input
		const { error: validationError } = resetPasswordUpdateSchema.validate({
			newPassword,
			confirmPassword
		});
		if (validationError) {
			return fail(400, { error: validationError.details[0].message });
		}

		let verifyFailed = false;
		let verifyErrorMessage = '';

		// Jika ada token dari URL, coba verifikasi
		// (Akan berhasil pada percobaan pertama, dan akan gagal pada percobaan kedua karena token sudah hangus)
		if (code && tokenType) {
			if (tokenType === 'pkce') {
				const { error } = await supabase.auth.exchangeCodeForSession(code);
				if (error) {
					verifyFailed = true;
					verifyErrorMessage = error.message.includes('code verifier')
						? 'Harap buka link reset di browser/perangkat yang SAMA tempat Anda memintanya.'
						: error.message;
				}
			} else {
				const { error } = await supabase.auth.verifyOtp({ token_hash: code, type: 'recovery' });
				if (error) {
					verifyFailed = true;
					verifyErrorMessage = error.message;
				}
			}
		}

		// Ambil session yang aktif.
		// Jika percobaan pertama gagal di tahap updateUser (misal: password lama dan baru sama), 
		// session sebenarnya SUDAH terbentuk dari exchangeCodeForSession di atas. 
		// Sehingga pada percobaan kedua, kita bisa menggunakan session ini.
		const { session } = await safeGetSession();

		if (!session) {
			// Jika tidak ada session dan verifikasi token gagal, berarti token benar-benar tidak valid
			return fail(400, { error: verifyFailed ? verifyErrorMessage : 'Tidak diizinkan atau sesi telah berakhir.' });
		}

		// Update password di Supabase menggunakan session yang aktif
		const { error } = await supabase.auth.updateUser({ password: newPassword! });

		if (error) {
			return fail(500, { error: error.message });
		}

		// Sign out setelah reset agar user login ulang dengan password baru
		await supabase.auth.signOut();

		throw redirect(303, '/auth/login?reset=success');
	}
};
