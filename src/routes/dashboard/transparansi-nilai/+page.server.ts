import type { PageServerLoad, Actions } from './$types';
// [DISABLED] Upload nilai feature disabled - no longer needed
// import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
    const { userData } = await parent();
    const isAsisten = userData.role === 'Asisten';

    // Asisten: fetch semua nilai + daftar praktikum untuk filter
    if (isAsisten) {
        try {
            const [scoresResult, praktikumResult] = await Promise.all([
                supabase
                    .from('nilai_praktikum')
                    .select(`
                        id, praktikum_id, nim, nama,
                        praktikum_u1, laporan_u1, total_nilai_u1,
                        praktikum_u2, laporan_u2, total_nilai_u2,
                        praktikum_u3, laporan_u3, total_nilai_u3,
                        praktikum_u4, laporan_u4, total_nilai_u4,
                        praktikum_u5, laporan_u5, total_nilai_u5,
                        praktikum_u6, laporan_u6, total_nilai_u6,
                        praktikum_u7, laporan_u7, total_nilai_u7,
                        praktikum_u8, laporan_u8, total_nilai_u8,
                        sosialisasi, responsi, absolut, grade,
                        list_praktikum:praktikum_id ( id, nama_praktikum, nama_lab, semester )
                    `)
                    .order('praktikum_id', { ascending: true })
                    .order('nama', { ascending: true }),
                supabase
                    .from('list_praktikum')
                    .select('id, nama_praktikum, nama_lab, semester')
                    .eq('semester', 'Genap')
                    .order('nama_praktikum', { ascending: true })
            ]);

            return {
                praktikumScores: [],
                allScores: scoresResult.data || [],
                listPraktikum: praktikumResult.data || []
            };
        } catch (error) {
            console.error('Unexpected error (Asisten):', error);
            return { praktikumScores: [], allScores: [], listPraktikum: [] };
        }
    }

    // Praktikan: hanya fetch nilai sendiri berdasarkan NIM
    if (!userData.nim) {
        return { praktikumScores: [], allScores: [], listPraktikum: [] };
    }

    try {
        const { data: scores, error } = await supabase
            .from('nilai_praktikum')
            .select(`
                id, praktikum_id, nim, nama,
                praktikum_u1, laporan_u1, total_nilai_u1,
                praktikum_u2, laporan_u2, total_nilai_u2,
                praktikum_u3, laporan_u3, total_nilai_u3,
                praktikum_u4, laporan_u4, total_nilai_u4,
                praktikum_u5, laporan_u5, total_nilai_u5,
                praktikum_u6, laporan_u6, total_nilai_u6,
                praktikum_u7, laporan_u7, total_nilai_u7,
                praktikum_u8, laporan_u8, total_nilai_u8,
                sosialisasi, responsi, absolut, grade,
                list_praktikum:praktikum_id ( id, nama_praktikum, nama_lab, semester )
            `)
            .eq('nim', userData.nim)
            .order('praktikum_id', { ascending: true });

        return { praktikumScores: scores || [], allScores: [], listPraktikum: [] };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { praktikumScores: [], allScores: [], listPraktikum: [] };
    }
};

// [DISABLED] Upload nilai feature disabled - no longer needed
// export const actions: Actions = {
//     uploadNilai: async ({ request, locals: { supabase } }) => {
//         const formData = await request.formData();
//         const file = formData.get('file') as File;
//         const praktikumId = formData.get('praktikum_id') as string; // Id praktikum yang disasar
//
//         if (!file || file.size === 0) {
//             return fail(400, { error: 'Berkas tidak boleh kosong' });
//         }
//         if (!praktikumId) {
//             return fail(400, { error: 'Praktikum ID harus diisi' });
//         }
//
//         try {
//             const text = await file.text();
//             const lines = text.split('\n');
//
//             const rowsToInsert = [];
//
//             // Membaca baris data (berdasarkan template, data mahasiswa dimulai dari baris index ke-5 atau setelah header)
//             for (let i = 0; i < lines.length; i++) {
//                 const line = lines[i].trim();
//                 if (!line) continue;
//
//                 const columns = line.split(',');
//
//                 // Skip header atau baris contoh awal (contoh baris: No, NIM, NAMA, KELOMPOK, dst)
//                 const nim = columns[1]?.trim();
//                 if (!nim || isNaN(Number(nim)) || nim.length < 10) {
//                     continue; // Lewati jika bukan baris berisi NIM mahasiswa asli
//                 }
//
//                 const nama = columns[2]?.trim();
//
//                 // Melakukan parsing kolom berdasarkan urutan kolom di CSV template Anda:
//                 // Kolom 4 & 5 -> Unit 1 (Laporan, Praktikum)
//                 // Kolom 7 & 8 -> Unit 2 (Laporan, Praktikum), dst...
//                 // Kolom 28 -> Total Nilai, Kolom 29 -> Responsi, Kolom 30 -> Nilai Akhir (Absolut), Kolom 31 -> Grade, Kolom 32 -> Sosialisasi (Hadir Sosialisasi)
//
//                 rowsToInsert.push({
//                     praktikum_id: praktikumId,
//                     nim: nim,
//                     nama: nama,
//                     laporan_u1: parseFloat(columns[4]) || 0,
//                     praktikum_u1: parseFloat(columns[5]) || 0,
//                     total_nilai_u1: parseFloat(columns[6]) || 0,
//
//                     laporan_u2: parseFloat(columns[7]) || 0,
//                     praktikum_u2: parseFloat(columns[8]) || 0,
//                     total_nilai_u2: parseFloat(columns[9]) || 0,
//
//                     laporan_u3: parseFloat(columns[10]) || 0,
//                     praktikum_u3: parseFloat(columns[11]) || 0,
//                     total_nilai_u3: parseFloat(columns[12]) || 0,
//
//                     laporan_u4: parseFloat(columns[13]) || 0,
//                     praktikum_u4: parseFloat(columns[14]) || 0,
//                     total_nilai_u4: parseFloat(columns[15]) || 0,
//
//                     laporan_u5: parseFloat(columns[16]) || 0,
//                     praktikum_u5: parseFloat(columns[17]) || 0,
//                     total_nilai_u5: parseFloat(columns[18]) || 0,
//
//                     laporan_u6: parseFloat(columns[19]) || 0,
//                     praktikum_u6: parseFloat(columns[20]) || 0,
//                     total_nilai_u6: parseFloat(columns[21]) || 0,
//
//                     laporan_u7: parseFloat(columns[22]) || 0,
//                     praktikum_u7: parseFloat(columns[23]) || 0,
//                     total_nilai_u7: parseFloat(columns[24]) || 0,
//
//                     laporan_u8: parseFloat(columns[25]) || 0,
//                     praktikum_u8: parseFloat(columns[26]) || 0,
//                     total_nilai_u8: parseFloat(columns[27]) || 0,
//
//                     responsi: parseFloat(columns[29]) || 0,
//                     absolut: parseFloat(columns[30]) || 0,
//                     grade: columns[31]?.trim() || null,
//                     sosialisasi: parseFloat(columns[32]) || 0 // Hadir Sosialisasi
//                 });
//                 console.log(rowsToInsert)
//             }
//
//             // Simpan ke database menggunakan upsert berdasarkan kombinasi (nim, praktikum_id)
//             const { error: upsertError } = await supabase
//                 .from('nilai_praktikum')
//                 .upsert(rowsToInsert, { onConflict: 'nim,praktikum_id' });
//
//             if (upsertError) {
//                 console.error('Database error:', upsertError);
//                 return fail(500, { error: 'Gagal menyimpan nilai ke database.' });
//             }
//
//             return { success: true, message: `Berhasil mengunggah ${rowsToInsert.length} data mahasiswa.` };
//
//         } catch (err) {
//             console.error(err);
//             return fail(500, { error: 'Terjadi kesalahan saat memproses file.' });
//         }
//     }
// };