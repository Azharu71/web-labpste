import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const labNameMap: Record<string, string> = {
	lab_dasel: 'Laboratorium Dasar Elektro',
	lab_tenaga: 'Laboratorium Tenaga',
	lab_kendali: 'Laboratorium Kendali',
	lab_telkom: 'Laboratorium Telekomunikasi',
	lab_kom: 'Laboratorium Komputer'
};

// @ts-expect-error - SvelteKit's PageServerLoad type inference breaks (expects session, user) 
// because the parent layout's unconditional redirect evaluates to 'never', corrupting the type union.
export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { labId } = params;
	const labName = labNameMap[labId];

	if (!labName) {
		throw error(404, 'Laboratorium tidak ditemukan');
	}

	try {
		// Mengambil daftar praktikum berdasarkan nama lab
		const { data: praktikum, error: dbError } = await supabase
			.from('list_praktikum')
			.select('id, nama_praktikum, semester, tahun')
			.eq('nama_lab', labName)
			.eq('semester', 'Genap')
			.order('nama_praktikum', { ascending: true });

		if (dbError) {
			console.error('Error fetching praktikum:', dbError);
			return { labId, labName, praktikum: [] };
		}

		return {
			labId,
			labName,
			praktikum: praktikum || []
		};
	} catch (err) {
		console.error('Unexpected error:', err);
		return { labId, labName, praktikum: [] };
	}
};
