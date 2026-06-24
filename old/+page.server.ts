import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
    const { userData } = await parent();

    // Default stats
    let totalPraktikan = 500;
    let totalPraktikum = 13;

    try {
        // Get unique student NIMs from nilai-praktikum where praktikum_id ends with 2526
        const { data: nilaiData, error: nilaiError } = await supabase
            .from('nilai-praktikum')
            .select('nim, praktikum_id')
            .like('praktikum_id', '%2526');

        if (!nilaiError && nilaiData) {
            // Count unique student NIMs
            const uniqueNims = new Set(nilaiData.map(item => item.nim));
            totalPraktikan = uniqueNims.size;
        }

        // Get total unique praktikum for semester 2526
        const { data: praktikumData, error: praktikumError } = await supabase
            .from('list-praktikum')
            .select('id')
            .like('id', '%2526');

        if (!praktikumError && praktikumData) {
            // Count unique practicum IDs
            const uniqueIds = new Set(praktikumData.map(item => item.id));
            totalPraktikum = uniqueIds.size;
        }
    } catch (err) {
        console.error('Error fetching stats:', err);
    }

    return {
        userData,
        stats: {
            totalAsisten: 28,
            totalPraktikan,
            totalPraktikum,
        },
        bestPraktikan: [
            {
                nim: '3332240083',
                name: 'Nabila Nurhaliza',
                praktikum: 'Dasar Telekomunikasi'
            },
            {
                nim: '3332230050',
                name: 'Daffa Nur Fauzan',
                praktikum: 'Pengolahan Sinyal Digital'
            },
            {
                nim: '3332240069',
                name: 'Selvy Irawan',
                praktikum: 'Rangkaian Listrik'
            },
            {
                nim: '3332230063',
                name: 'Bella Azhar Kautsar',
                praktikum: 'Antenna dan Propagasi'
            },
            {
                nim: '3332230107',
                name: 'Muhammad Fathurrizki',
                praktikum: 'Elektronika Daya'
            },
            {
                nim: '3332250014',
                name: 'Moch Saiful Abdul Latif',
                praktikum: 'Teknik Digital'
            }
        ]
    };
};
