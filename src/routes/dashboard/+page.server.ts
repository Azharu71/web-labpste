import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	const { userData } = await parent();

	// Default stats
	let totalPraktikan = 0;
	let totalPraktikum = 0;
	let totalAsisten = 27;

	try {
		const [
			{ count: praktikanCount, error: praktikanError },
			{ count: praktikumCount, error: praktikumError }
		] = await Promise.all([
			// Count Praktikan (role_id = 2)
			supabase.from('profiles').select('count', { count: 'exact', head: true }).eq('role_id', '2'),

			// Count Praktikum (semester = Ganjil)
			supabase
				.from('list_praktikum')
				.select('count', { count: 'exact', head: true })
				.eq('semester', 'Ganjil')
		]);

		if (!praktikanError && praktikanCount !== null) totalPraktikan = praktikanCount;
		if (!praktikumError && praktikumCount !== null) totalPraktikum = praktikumCount;
	} catch (err) {
		console.error('Error fetching stats:', err);
	}

	// Fetch myPraktikums
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let myPraktikums: any[] = [];

	try {
		const { data: myPraktikumData, error: myPraktikumError } = await supabase
			.from('daftar_praktikan')
			.select(
				`
				id,
				praktikum_id,
				list_praktikum!inner(nama_praktikum, nama_lab, semester)
			`
			)
			.eq('user_id', userData.id)
			.eq('list_praktikum.semester', 'Ganjil');

		if (!myPraktikumError && myPraktikumData) {
			myPraktikums = myPraktikumData;
		}
	} catch (err) {
		console.error('Error fetching my praktikum:', err);
	}

	return {
		userData,
		stats: {
			totalAsisten,
			totalPraktikan,
			totalPraktikum
		},
		myPraktikums,
		bestPraktikan: []
	};
};
