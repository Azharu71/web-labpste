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
		const files = formData.getAll('modul');
		const file = files[0] as File;
		const praktikumId = formData.get('praktikum_id') as string;

		// Tolak jika ada lebih dari satu file dikirim
		if (files.length > 1) {
			return fail(400, { message: 'Hanya boleh mengunggah satu file.' });
		}

		if (!file || !praktikumId || file.size === 0) {
			return fail(400, { message: 'File dan ID Praktikum diperlukan' });
		}

		if (file.type !== 'application/pdf') {
			return fail(400, { message: 'Hanya file PDF yang diperbolehkan' });
		}

		const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
		if (file.size > MAX_SIZE) {
			return fail(400, { message: 'Ukuran file tidak boleh lebih dari 15 MB' });
		}

		const fileName = `Modul-${praktikumId}`;

		const { error: uploadError } = await locals.supabase.storage
			.from('Modul_praktikum')
			.upload(fileName, file, { upsert: true, cacheControl: '3600' });

		if (uploadError) {
			console.error('Upload error:', uploadError);
			return fail(500, { message: `Gagal mengunggah file: ${uploadError.message}` });
		}

		const { error: updateError } = await locals.supabase
			.from('list_praktikum')
			.update({ url_modul: fileName })
			.eq('id', praktikumId);

		if (updateError) {
			console.error('Update DB error:', updateError);
			return fail(500, { message: 'Gagal menyimpan URL ke database' });
		}

		return { success: true, message: 'Berhasil mengunggah Modul!' };
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
			return fail(400, { message: 'Data tidak lengkap' });
		}

		const fileName = `Modul-${praktikumId}`;

		// Hapus dari storage — log jika gagal (misal belum ada RLS policy),
		// tapi tetap lanjutkan untuk membersihkan DB
		const { error: deleteError } = await locals.supabase.storage
			.from('Modul_praktikum')
			.remove([fileName]);

		if (deleteError) {
			console.warn('Storage delete warning (file mungkin perlu dibersihkan manual):', deleteError.message);
		}

		const { error: updateError } = await locals.supabase
			.from('list_praktikum')
			.update({ url_modul: null })
			.eq('id', praktikumId);

		if (updateError) {
			console.error('Update DB error:', updateError);
			return fail(500, { message: 'Gagal mengupdate database' });
		}

		return { success: true };
	}
};
