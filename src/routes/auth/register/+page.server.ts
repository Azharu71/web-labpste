import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { registerSchema } from '$lib/schemas/auth';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const supabase = locals.supabase;
		const data = await request.formData();

		const nim = data.get('nim')?.toString();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		const returnData = { nim, email };

		const { error: validationError } = registerSchema.validate({ nim, email, password, confirmPassword });

		if (validationError) {
			return fail(400, { ...returnData, error: validationError.details[0].message });
		}

		// 1. Register ke Supabase Auth (auth.users)
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: email!,
			password: password!
		});

		if (authError) {
			return fail(400, { ...returnData, error: authError.message });
		}

		// 2. Insert ke tabel profiles (public.profiles)
		if (authData.user) {
			const { error: profileError } = await supabase.from('profiles').insert({
				id: authData.user.id, // Relasi ke auth.users
				nim: nim!,
				role_id: 1 // Default role: Praktikan (sesuai konteks dashboard)
			});
			if (profileError) {
				return fail(400, {
					...returnData,
					error: 'Gagal menyimpan data profil: ' + profileError.message
				});
			}
		}

		// Logout user agar session dibersihkan dan tidak di-redirect otomatis ke dashboard oleh layout
		await supabase.auth.signOut();

		throw redirect(303, '/auth/login?registered=true');
	}
};
