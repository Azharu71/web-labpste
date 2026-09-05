import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, parent }) => {
	const { userData } = await parent();

	const { data: praktikum, error: dbError } = await supabase
		.from('list_praktikum')
		.select('id, nama_praktikum, nama_lab, semester, tahun, form_laporan')
		.eq('semester', 'Ganjil')
		.order('nama_lab', { ascending: true })
		.order('nama_praktikum', { ascending: true });

	if (dbError) {
		console.error('Error fetching praktikum:', dbError);
		return { praktikumList: [], userData };
	}

	return {
		praktikumList: praktikum || [],
		userData
	};
};
