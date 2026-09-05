import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Signed URL berlaku 1 jam
const SIGNED_URL_EXPIRY = 60 * 60;

export const load: PageServerLoad = async ({ params, locals: { supabase }, parent }) => {
	const { userData } = await parent();

	const { data: praktikum, error: err } = await supabase
		.from('list_praktikum')
		.select('id, nama_praktikum, nama_lab, semester, url_modul')
		.eq('id', params.id)
		.single();

	if (err || !praktikum) {
		throw error(404, 'Praktikum tidak ditemukan');
	}

	if (!praktikum.url_modul) {
		throw redirect(303, '/dashboard/modul-praktikum');
	}

	const fileName = `Modul-${params.id}`;
	const { data: signedData, error: signError } = await supabase.storage
		.from('Modul_praktikum')
		.createSignedUrl(fileName, SIGNED_URL_EXPIRY);

	if (signError) {
		console.warn(`Signed URL warning for modul ${params.id}:`, signError.message);
	}

	return {
		praktikum: {
			...praktikum,
			signedUrl: signedData?.signedUrl ?? null,
			fileNotFound: !signedData?.signedUrl
		},
		userData
	};
};
