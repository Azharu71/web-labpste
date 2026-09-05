import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { isAsistenOrSU } from '$lib/profile-cache';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	const { userData } = await parent();

	const { data: dokumenList, error: err } = await supabase
		.from('dokumen_administrasi')
		.select('id, nama, deskripsi, tipe, url')
		.order('id', { ascending: true });

	if (err) {
		console.error('Error fetching dokumen_administrasi:', err);
		throw error(500, 'Gagal mengambil data dokumen administrasi');
	}

	return {
		dokumenList: dokumenList || [],
		userData
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
		const files = formData.getAll('file');
		const file = files[0] as File;
		const docId = formData.get('doc_id') as string;

		// Tolak jika ada lebih dari satu file dikirim
		if (files.length > 1) {
			return fail(400, { message: 'Hanya boleh mengunggah satu file.' });
		}

		if (!file || !docId || file.size === 0) {
			return fail(400, { message: 'File dan ID Dokumen diperlukan.' });
		}

		const MAX_SIZE = 25 * 1024 * 1024; // 25 MB
		if (file.size > MAX_SIZE) {
			return fail(400, { message: 'Ukuran file tidak boleh lebih dari 25 MB.' });
		}

		const fileExt = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : '';
		const fileName = fileExt ? `doc-${docId}.${fileExt}` : `doc-${docId}`;

		const { error: uploadError } = await locals.supabase.storage
			.from('Administrasi')
			.upload(fileName, file, { upsert: true, cacheControl: '3600' });

		if (uploadError) {
			console.error('Upload error:', uploadError);
			return fail(500, { message: `Gagal mengunggah file: ${uploadError.message}` });
		}

		const { error: updateError } = await locals.supabase
			.from('dokumen_administrasi')
			.update({ url: fileName, updated_at: new Date().toISOString() })
			.eq('id', docId);

		if (updateError) {
			console.error('Update DB error:', updateError);
			return fail(500, { message: 'Gagal menyimpan URL ke database.' });
		}

		return { success: true, message: 'Berhasil mengunggah Dokumen!' };
	},

	delete: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'Unauthorized' });

		const allowed = await isAsistenOrSU(locals.supabase, user.id);
		if (!allowed) {
			return fail(403, { message: 'Forbidden. Hanya Asisten yang diizinkan.' });
		}

		const formData = await request.formData();
		const docId = formData.get('doc_id') as string;

		if (!docId) {
			return fail(400, { message: 'Data tidak lengkap.' });
		}

		const { data: doc } = await locals.supabase
			.from('dokumen_administrasi')
			.select('url')
			.eq('id', docId)
			.single();

		if (doc?.url) {
			const { error: deleteError } = await locals.supabase.storage
				.from('Administrasi')
				.remove([doc.url]);

			if (deleteError) {
				console.warn('Storage delete warning:', deleteError.message);
			}
		}

		const { error: updateError } = await locals.supabase
			.from('dokumen_administrasi')
			.update({ url: null, updated_at: new Date().toISOString() })
			.eq('id', docId);

		if (updateError) {
			console.error('Update DB error:', updateError);
			return fail(500, { message: 'Gagal mengupdate database.' });
		}

		return { success: true, message: 'Dokumen berhasil dihapus!' };
	}
};
