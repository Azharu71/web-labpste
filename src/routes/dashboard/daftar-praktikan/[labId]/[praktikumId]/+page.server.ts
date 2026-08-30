import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const labNameMap: Record<string, string> = {
	lab_dasel: 'Laboratorium Dasar Elektro',
	lab_tenaga: 'Laboratorium Tenaga',
	lab_kendali: 'Laboratorium Kendali',
	lab_telkom: 'Laboratorium Telekomunikasi',
	lab_kom: 'Laboratorium Komputer'
};

export const load: PageServerLoad = async ({ params, locals: { supabase }, parent }) => {
	const { userData } = await parent();

	if (userData.role !== 'Asisten' && userData.role !== 'SU') {
		throw error(403, 'Forbidden. Access restricted to Assistants.');
	}

	const { labId, praktikumId } = params;
	const labName = labNameMap[labId];

	if (!labName) {
		throw error(404, 'Laboratorium tidak ditemukan');
	}

	// Jalankan kedua query secara paralel — tidak ada dependensi satu sama lain
	const [{ data: praktikumData, error: praktikumError }, { data: interns, error: dbError }] =
		await Promise.all([
			supabase
				.from('list_praktikum')
				.select('nama_praktikum')
				.eq('id', praktikumId)
				.single(),
			supabase
				.from('daftar_praktikan')
				.select(
					'id, full_name, nim, ipk, krs_type, krs_url, keterangan, created_at, jadwal_kosong(senin,selasa,rabu,kamis,jumat,sabtu,minggu)'
				)
				.eq('praktikum_id', praktikumId)
				.order('created_at', { ascending: false })
		]);

	if (praktikumError) {
		console.error('Error fetching praktikum details:', praktikumError);
		throw error(404, 'Praktikum tidak ditemukan');
	}

	if (dbError) {
		console.error('Error fetching interns:', dbError);
		return { labId, labName, praktikumId, praktikumName: praktikumData?.nama_praktikum, interns: [] };
	}

	return {
		labId,
		labName,
		praktikumId,
		praktikumName: praktikumData?.nama_praktikum,
		interns: interns || []
	};
};
