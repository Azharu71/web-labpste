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
		const docId = formData.get('doc_id') as string;
		const url = (formData.get('url') as string)?.trim();

		if (!docId || !url) {
			return fail(400, { message: 'ID Dokumen dan Link Google Drive diperlukan.' });
		}

		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			return fail(400, { message: 'URL harus diawali dengan http:// atau https://' });
		}

		const { error: updateError } = await locals.supabase
			.from('dokumen_administrasi')
			.update({ url, updated_at: new Date().toISOString() })
			.eq('id', docId);

		if (updateError) {
			console.error('Update DB error:', updateError);
			return fail(500, { message: 'Gagal menyimpan link dokumen ke database.' });
		}

		return { success: true, message: 'Berhasil menyimpan link dokumen!' };
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
