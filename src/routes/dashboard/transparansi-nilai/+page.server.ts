import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
    // Get user data from parent layout
    const { userData } = await parent();

    if (!userData.nim) {
        return {
            praktikumScores: []
        };
    }

    try {
        // Fetch user's praktikum scores with praktikum details
        const { data: scores, error } = await supabase
            .from('nilai-praktikum')
            .select(`
                id,
                praktikum_id,
                nim,
                nama,
                praktikum_u1,
                laporan_u1,
                total_nilai_u1,
                praktikum_u2,
                laporan_u2,
                total_nilai_u2,
                praktikum_u3,
                laporan_u3,
                total_nilai_u3,
                praktikum_u4,
                laporan_u4,
                total_nilai_u4,
                praktikum_u5,
                laporan_u5,
                total_nilai_u5,
                praktikum_u6,
                laporan_u6,
                total_nilai_u6,
                praktikum_u7,
                laporan_u7,
                total_nilai_u7,
                praktikum_u8,
                laporan_u8,
                total_nilai_u8,
                sosialisasi,
                responsi,
                absolut,
                grade,
                list_praktikum:praktikum_id (
                    id,
                    nama_praktikum,
                    nama_lab,
                    semester
                )
            `)
            .eq('nim', userData.nim)
            .order('praktikum_id', { ascending: true });

        if (error) {
            console.error('Error fetching praktikum scores:', error);
            return {
                praktikumScores: []
            };
        }

        return {
            praktikumScores: scores || []
        };
    } catch (error) {
        console.error('Unexpected error fetching praktikum scores:', error);
        return {
            praktikumScores: []
        };
    }
};
