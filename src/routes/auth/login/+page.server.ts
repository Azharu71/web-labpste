import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { loginSchema } from '$lib/schemas/auth';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const supabase = locals.supabase;
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		const { error: validationError } = loginSchema.validate({ email, password });


		if (validationError) {
			return fail(400, { email, error: validationError.details[0].message });
		}

		// Proses login menggunakan Supabase
		const { error } = await supabase.auth.signInWithPassword({
			email: email!,
			password: password!
		});

		// Jika terjadi error (misal: password salah)
		if (error) {
			return fail(400, {
				email,
				error: 'Email atau password salah'
			});
		}

		// Jika berhasil, redirect ke halaman dashboard
		throw redirect(303, '/dashboard');
	}
};
