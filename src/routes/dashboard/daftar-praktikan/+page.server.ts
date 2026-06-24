import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { userData } = await parent();

	if (userData.role !== 'Asisten' && userData.role !== 'SU') {
		throw error(403, 'Forbidden. Access restricted to Assistants.');
	}

	return {};
};
