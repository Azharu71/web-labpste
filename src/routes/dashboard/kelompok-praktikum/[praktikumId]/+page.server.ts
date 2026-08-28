import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Mapping praktikumId -> URL pubhtml Google Spreadsheet
// Tambahkan entry sesuai ID praktikum dari database
const spreadsheetMap: Record<string, string> = {
	
};

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { praktikumId } = params;

	const { data: praktikumData, error: dbError } = await supabase
		.from('list_praktikum')
		.select('id, nama_praktikum, nama_lab, semester, tahun')
		.eq('id', praktikumId)
		.single();

	if (dbError || !praktikumData) {
		throw error(404, 'Praktikum tidak ditemukan');
	}

	const spreadsheetUrl = spreadsheetMap[praktikumId] ? spreadsheetMap[praktikumId] : null;

	return {
		praktikum: praktikumData,
		spreadsheetUrl
	};
};
