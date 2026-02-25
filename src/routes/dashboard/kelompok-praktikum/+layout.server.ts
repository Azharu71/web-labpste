import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
	const { data: praktikum, error: dbError } = await supabase
		.from('list_praktikum')
		.select('id, nama_praktikum, nama_lab, semester, tahun')
		.eq('semester', 'Genap')
		.order('nama_lab', { ascending: true })
		.order('nama_praktikum', { ascending: true });

	if (dbError) {
		console.error('Error fetching praktikum:', dbError);
		return { praktikumList: [] };
	}

	return {
		praktikumList: praktikum || []
	};
};
