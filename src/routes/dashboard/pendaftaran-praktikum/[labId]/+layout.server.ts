import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	// Mencegah akses ke semua children dari [labId]
	// throw redirect(302, '/dashboard/pendaftaran-praktikum');
};
