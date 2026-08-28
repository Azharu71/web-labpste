import type { PageServerLoad } from './$types';

// ─── Daftar dokumen administrasi — tambah atau ubah di sini ──────────────────
const dokumen = [
	{
		nama: 'Panduan Laporan Praktikum',
		deskripsi: 'Panduan untuk membuat laporan praktikum',
		tipe: 'pdf' as const,
		url: ''
	},
	{
		nama: 'Contoh Laporan (PDF)',
		deskripsi: 'Contoh laporan praktikum dalam format PDF',
		tipe: 'pdf' as const,
		url: ''
	},
	{
		nama: 'Contoh Laporan (DOCX)',
		deskripsi: 'Contoh laporan praktikum',
		tipe: 'docx' as const,
		url: ''
	},
	{
		nama: 'ID Card',
		deskripsi: 'Tanda pengenal praktikum',
		tipe: 'docx' as const,
		url: ''
	},
	{
		nama: 'Pedoman LAB',
		deskripsi: 'Pedoman laboratorium PSTE',
		tipe: 'pdf' as const,
		url: ''
	},
	{
		nama: 'K3 Laboratorium',
		deskripsi: 'Buku panduan K3 Laboratorium PSTE',
		tipe: 'pdf' as const,
		url: ''
	}
];
// ─────────────────────────────────────────────────────────────────────────────

export const load: PageServerLoad = async () => {
	return { dokumen };
};
