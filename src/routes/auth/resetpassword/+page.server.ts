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

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');

	if (code) {
		// Exchange PKCE code dengan session
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (error) {
			return { mode: 'request' as const, exchangeError: error.message };
		}
		return { mode: 'update' as const };
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
				error: `For security purposes, you can only request this after ${secondsLeft} seconds.`,
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
			message: 'Check your email if it is registered for a reset password link.',
			secondsLeft: COOLDOWN_SECONDS
		};
	},

	// Tahap 2: Update password baru
	updatePassword: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const newPassword = formData.get('newPassword')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		// Validasi input
		const { error: validationError } = resetPasswordUpdateSchema.validate({
			newPassword,
			confirmPassword
		});
		if (validationError) {
			return fail(400, { error: validationError.details[0].message });
		}

		// Update password di Supabase
		const { error } = await supabase.auth.updateUser({ password: newPassword! });

		if (error) {
			return fail(500, { error: error.message });
		}

		// Sign out setelah reset agar user login ulang dengan password baru
		await supabase.auth.signOut();

		throw redirect(303, '/auth/login?reset=success');
	}
};
