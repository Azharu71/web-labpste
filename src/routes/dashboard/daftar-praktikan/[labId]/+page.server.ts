import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const labNameMap: Record<string, string> = {
	lab_dasel: 'Laboratorium Dasar Elektro',
	lab_tenaga: 'Laboratorium Tenaga',
	lab_kendali: 'Laboratorium Kendali',
	lab_telkom: 'Laboratorium Telekomunikasi',
	lab_kom: 'Laboratorium Komputer'
};

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const labName = labNameMap[params.labId];

	if (!labName) {
		throw error(404, 'Laboratorium tidak ditemukan');
	}

	const { data: praktikum, error: dbError } = await supabase
		.from('list_praktikum')
		.select('id, nama_praktikum, semester, tahun')
		.eq('nama_lab', labName)
		.eq('semester', 'Genap')
		.order('nama_praktikum', { ascending: true });

	if (dbError) {
		console.error('Error fetching praktikum:', dbError);
		return { labId: params.labId, labName, praktikum: [] };
	}

	return {
		labId: params.labId,
		labName,
		praktikum: praktikum ?? []
	};
};
