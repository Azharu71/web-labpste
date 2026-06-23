import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	const { userData } = await parent();

	// Default stats
	let totalPraktikan = 0;
	let totalPraktikum = 0;
	let totalAsisten = 0;

	try {
		const [
			{ count: praktikanCount, error: praktikanError },
			{ count: praktikumCount, error: praktikumError },
			{ count: asistenCount, error: asistenError }
		] = await Promise.all([
			// Count Praktikan (role_id = 2)
			supabase.from('profiles').select('count', { count: 'exact', head: true }).eq('role_id', '2'),

			// Count Praktikum (semester = Genap)
			supabase
				.from('list_praktikum')
				.select('count', { count: 'exact', head: true })
				.eq('semester', 'Genap'),

			// Count Asisten (role_id = 1)
			supabase.from('profiles').select('count', { count: 'exact', head: true }).eq('role_id', '1')
		]);

		if (!praktikanError && praktikanCount !== null) totalPraktikan = praktikanCount;
		if (!praktikumError && praktikumCount !== null) totalPraktikum = praktikumCount;
		if (!asistenError && asistenCount !== null) totalAsisten = asistenCount;
	} catch (err) {
		console.error('Error fetching stats:', err);
	}

	return {
		userData,
		stats: {
			totalAsisten,
			totalPraktikan,
			totalPraktikum
		},

		bestPraktikan: [
			{
				nim: '3332250005',
				name: 'Shaeful Anam',
				praktikum: 'Dasar Elektronika'
			},
			{
				nim: '3332240022',
				name: 'M. Riadhusholihin',
				praktikum: 'Pengukuran Listrik'
			},
			{
				nim: '3332240110',
				name: 'Dewi Uma Angelina',
				praktikum: 'Dasar Sistem Kendali'
			},
			{
				nim: '3332230066',
				name: 'Muhammad Rivaldy Pratama',
				praktikum: 'Instrumentasi Kendali'
			},
			{
				nim: '3332230050',
				name: 'Daffa Nur Fauzan',
				praktikum: 'Sistem Kendali Digital'
			},
			{
				nim: '3332230025',
				name: 'Valentino Pahotan Simamora',
				praktikum: 'Mesin Listrik'
			},
			{
				nim: '3332250188',
				name: 'Maheswari Anindya Lituhayu Tuswandi',
				praktikum: 'Komputasi Numerik'
			}
		]

	};
};
