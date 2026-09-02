import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { praktikumId } = params;

	const { data: praktikumData, error: dbError } = await supabase
		.from('list_praktikum')
		.select('id, nama_praktikum, nama_lab, semester, tahun, kelompok_jadwal')
		.eq('id', praktikumId)
		.single();

	if (dbError || !praktikumData) {
		throw error(404, 'Praktikum tidak ditemukan');
	}

	return {
		praktikum: praktikumData,
		spreadsheetUrl: praktikumData.kelompok_jadwal || null
	};
};
