import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { isAsistenOrSU } from '$lib/profile-cache';

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Unauthorized' });

		const allowed = await isAsistenOrSU(locals.supabase, user.id);
		if (!allowed) {
			return fail(403, { message: 'Forbidden. Hanya Asisten yang diizinkan.' });
		}

		const formData = await request.formData();
		const praktikumId = formData.get('praktikum_id') as string;
		const formLaporan = formData.get('form_laporan') as string;

		if (!praktikumId || !formLaporan) {
			return fail(400, { message: 'ID Praktikum dan URL Form diperlukan.' });
		}

		// Basic URL validation
		try {
			new URL(formLaporan);
		} catch {
			return fail(400, { message: 'URL Form tidak valid.' });
		}

		const { error: updateError } = await locals.supabase
			.from('list_praktikum')
			.update({ form_laporan: formLaporan })
			.eq('id', praktikumId);

		if (updateError) {
			console.error('Update form_laporan error:', updateError);
			return fail(500, { message: 'Gagal menyimpan URL form ke database.' });
		}

		return { success: true, message: 'Form pengumpulan berhasil diperbarui!' };
	},

	delete: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Unauthorized' });

		const allowed = await isAsistenOrSU(locals.supabase, user.id);
		if (!allowed) {
			return fail(403, { message: 'Forbidden. Hanya Asisten yang diizinkan.' });
		}

		const formData = await request.formData();
		const praktikumId = formData.get('praktikum_id') as string;

		if (!praktikumId) {
			return fail(400, { message: 'ID Praktikum diperlukan.' });
		}

		const { error: updateError } = await locals.supabase
			.from('list_praktikum')
			.update({ form_laporan: null })
			.eq('id', praktikumId);

		if (updateError) {
			console.error('Delete form_laporan error:', updateError);
			return fail(500, { message: 'Gagal menghapus URL form dari database.' });
		}

		return { success: true, message: 'Form pengumpulan berhasil dihapus!' };
	}
};
