// import type { PageServerLoad } from './$types';
// import { error } from '@sveltejs/kit';

// export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
//     const { userData } = await parent();

//     if (userData.role !== 'Asisten') {
//         throw error(403, 'Access denied. Asisten role required.');
//     }
//     try {
//         const { data: nilaiPraktikum, error } = await supabase
//             .from('nilai-praktikum')
//             .select('*')
//             .order('id', { ascending: true });

//         if (error) {
//             console.error('Error fetching nilai praktikum data:', error);
//             return {
//                 nilaiPraktikum: []
//             };
//         }

//         return {
//             nilaiPraktikum: nilaiPraktikum || []
//         };
//     } catch (err) {
//         console.error('Unexpected error fetching nilai praktikum data:', err);
//         return {
//             nilaiPraktikum: []
//         };
//     }
// };