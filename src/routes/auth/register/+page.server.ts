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


		// 0. Cek apakan NIM sudah terdaftar
		const { data: existingUser } = await supabase
			.from('profiles')
			.select('nim')
			.eq('nim', nim)
			.maybeSingle();

		if (existingUser) {
			return fail(400, {
				...returnData,
				error: 'NIM anda sudah terdaftar!'
			});
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
				id: authData.user.id,
				nim: nim!,
				role_id: 1
			});
			if (profileError) {
				return fail(400, {
					...returnData,
					error: 'Gagal menyimpan data profil: ' + profileError.message
				});
			}
		}


		throw redirect(303, '/auth/login?registered=true');
	}
};
