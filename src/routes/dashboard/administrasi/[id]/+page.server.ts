import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// ─── Sama dengan daftar di +page.server.ts parent ────────────────────────────
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
		nama: 'Contoh Laporan',
		deskripsi: 'Contoh laporan praktikum',
		tipe: 'docx' as const,
		url: 'https://dglpmddnwckzlvbvtzxn.supabase.co/storage/v1/object/public/Administrasi/contoh_laporan_praktikum2026.docx'
	},
	{
		nama: 'Tanda Pengenal',
		deskripsi: 'Tanda pengenal praktikum',
		tipe: 'docx' as const,
		url: 'https://dglpmddnwckzlvbvtzxn.supabase.co/storage/v1/object/public/Administrasi/tanda_pengenal_praktikum.docx'
	}
];
// ─────────────────────────────────────────────────────────────────────────────

export const load: PageServerLoad = async ({ params }) => {
	const index = parseInt(params.id);

	if (isNaN(index) || index < 0 || index >= dokumen.length) {
		throw error(404, 'Dokumen tidak ditemukan');
	}

	return { doc: dokumen[index] };
};
