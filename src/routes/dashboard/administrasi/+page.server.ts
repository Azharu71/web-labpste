import type { PageServerLoad } from './$types';

// ─── Daftar dokumen administrasi — tambah atau ubah di sini ──────────────────
const dokumen = [
	{
		nama: 'Panduan Laporan Praktikum',
		deskripsi: 'Panduan untuk membuat laporan praktikum',
		tipe: 'pdf' as const,
		url: 'https://dglpmddnwckzlvbvtzxn.supabase.co/storage/v1/object/public/Administrasi/panduan_laporan_praktikum2026.pdf'
	},
	{
		nama: 'Contoh Laporan (PDF)',
		deskripsi: 'Contoh laporan praktikum dalam format PDF',
		tipe: 'pdf' as const,
		url: 'https://dglpmddnwckzlvbvtzxn.supabase.co/storage/v1/object/public/Administrasi/contoh_laporan_praktikum2026.pdf'
	},
	{
		nama: 'Contoh Laporan (DOCX)',
		deskripsi: 'Contoh laporan praktikum',
		tipe: 'docx' as const,
		url: 'https://dglpmddnwckzlvbvtzxn.supabase.co/storage/v1/object/public/Administrasi/contoh_laporan_praktikum2026.docx'
	},
];
// ─────────────────────────────────────────────────────────────────────────────

export const load: PageServerLoad = async () => {
	return { dokumen };
};
