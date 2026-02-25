import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Signed URL berlaku 1 jam
const SIGNED_URL_EXPIRY = 60 * 60;

export const load: PageServerLoad = async ({ params, locals: { supabase }, parent }) => {
	const { userData } = await parent();

	// Jalankan DB query dan signed URL generation secara parallel
	// — keduanya tidak saling bergantung, fileName cukup dari params.id
	const fileName = `Modul-${params.id}`;

	const [{ data: praktikum, error: err }, { data: signedData, error: signError }] =
		await Promise.all([
			supabase
				.from('list_praktikum')
				.select('id, nama_praktikum, nama_lab, semester, url_modul')
				.eq('id', params.id)
				.single(),
			supabase.storage.from('Modul_praktikum').createSignedUrl(fileName, SIGNED_URL_EXPIRY)
		]);

	if (err || !praktikum) {
		throw error(404, 'Praktikum tidak ditemukan');
	}

	if (!praktikum.url_modul) {
		throw redirect(303, '/dashboard/modul-praktikum');
	}

	if (signError || !signedData?.signedUrl) {
		console.error('Signed URL error:', signError);
		throw error(500, 'Gagal mengakses file modul');
	}

	return {
		praktikum: {
			...praktikum,
			signedUrl: signedData.signedUrl
		},
		userData
	};
};
