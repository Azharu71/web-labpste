import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCachedProfile, setCachedProfile } from '$lib/profile-cache';

export const load: LayoutServerLoad = async ({
	locals: { supabase },
	setHeaders,
	parent,
	url
}) => {
	// Get user session from parent (root layout)
	const parentData = await parent();
	const user = await parentData.user;

	// Redirect if no session
	if (!user) {
		throw redirect(303, '/auth/login');
	}

	// Header cache privat untuk dashboard: cegah browser menahan cache basi saat ada pembaruan data
	// (Kecuali halaman pendaftaran-praktikum yang mengatur header no-store sendiri)
	if (!url.pathname.includes('/pendaftaran-praktikum/')) {
		setHeaders({
			'Cache-Control': 'private, no-cache, must-revalidate',
			Vary: 'Cookie'
		});
	}

	const userId = user.id;

	// Try to get cached profile data
	const cachedData = getCachedProfile(userId);
	if (cachedData) return { userData: cachedData };

	const { data: profile } = await supabase
		.from('profiles')
		.select('nim, roles ( name )')
		.eq('id', userId)
		.single();

	// Extract role name safely (handling array or object response)
	const roleData = profile?.roles;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const roleName = Array.isArray(roleData) ? roleData[0]?.name : (roleData as any)?.name;

	const userData = {
		id: userId,
		nim: user.user_metadata?.nim || profile?.nim || null,
		email: user.email || null,
		role: roleName || null
	};

	// Cache the result
	setCachedProfile(userId, userData);

	return { userData };
};
