import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	const { userData } = await parent();

	if (userData.role !== 'Asisten' && userData.role !== 'SU' ) {
		throw error(403, 'Access denied. Asisten role required.');
	}
	try {
		const { data: praktikum, error } = await supabase
			.from('list_praktikum')
			.select('id, nama_praktikum, nama_lab, semester, tahun')
			.order('id', { ascending: true });

		if (error) {
			console.error('Error fetching praktikum data:', error);
			return {
				praktikum: []
			};
		}

		return {
			praktikum: praktikum || []
		};
	} catch (err) {
		console.error('Unexpected error fetching praktikum data:', err);
		return {
			praktikum: []
		};
	}
};
