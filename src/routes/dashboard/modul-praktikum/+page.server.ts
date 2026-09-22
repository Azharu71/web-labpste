import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { isAsistenOrSU } from '$lib/profile-cache';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: praktikumList, error: err } = await supabase
		.from('list_praktikum')
		.select('id, nama_praktikum, nama_lab, semester, url_modul')
		.eq('semester', 'Ganjil')
		.order('nama_praktikum', { ascending: true });

	if (err) {
		console.error('Error fetching praktikum list:', err);
		throw error(500, 'Gagal mengambil data praktikum');
	}

	return {
		praktikumList: praktikumList || []
	};
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Unauthorized' });

		const allowed = await isAsistenOrSU(locals.supabase, user.id);
		if (!allowed) {
			return fail(403, { message: 'Forbidden. Hanya Asisten yang diizinkan.' });
		}

		const formData = await request.formData();
		const praktikumId = formData.get('praktikum_id') as string;
		const urlModul = (formData.get('url_modul') as string)?.trim();

		if (!praktikumId || !urlModul) {
			return fail(400, { message: 'ID Praktikum dan Link Google Drive diperlukan.' });
		}

		if (!urlModul.startsWith('http://') && !urlModul.startsWith('https://')) {
			return fail(400, { message: 'URL harus diawali dengan http:// atau https://' });
		}

		const { error: updateError } = await locals.supabase
			.from('list_praktikum')
			.update({ url_modul: urlModul })
			.eq('id', praktikumId);

		if (updateError) {
			console.error('Update DB error:', updateError);
			return fail(500, { message: 'Gagal menyimpan link modul ke database.' });
		}

		return { success: true, message: 'Berhasil menyimpan link modul!' };
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
			return fail(400, { message: 'Data tidak lengkap.' });
		}

		const { error: updateError } = await locals.supabase
			.from('list_praktikum')
			.update({ url_modul: null })
			.eq('id', praktikumId);

		if (updateError) {
			console.error('Update DB error:', updateError);
			return fail(500, { message: 'Gagal mengupdate database.' });
		}

		return { success: true, message: 'Link modul berhasil dihapus!' };
	}
};
