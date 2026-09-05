import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const SIGNED_URL_EXPIRY = 60 * 60; // 1 jam

export const load: PageServerLoad = async ({ params, locals: { supabase }, parent }) => {
	const { userData } = await parent();

	const docId = parseInt(params.id, 10);
	if (isNaN(docId)) {
		throw error(404, 'Dokumen tidak ditemukan');
	}

	const { data: doc, error: err } = await supabase
		.from('dokumen_administrasi')
		.select('id, nama, deskripsi, tipe, url')
		.eq('id', docId)
		.single();

	if (err || !doc) {
		throw error(404, 'Dokumen tidak ditemukan');
	}

	if (!doc.url) {
		throw redirect(303, '/dashboard/administrasi');
	}

	const { data: signedData, error: signError } = await supabase.storage
		.from('Administrasi')
		.createSignedUrl(doc.url, SIGNED_URL_EXPIRY);

	if (signError) {
		console.warn(`Signed URL warning for doc ${docId} (${doc.url}):`, signError.message);
	}

	return {
		doc: {
			...doc,
			signedUrl: signedData?.signedUrl ?? null,
			fileNotFound: !signedData?.signedUrl
		},
		userData
	};
};
