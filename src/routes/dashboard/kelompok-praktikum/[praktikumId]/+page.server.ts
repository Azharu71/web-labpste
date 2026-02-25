import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Mapping praktikumId -> URL pubhtml Google Spreadsheet
// Tambahkan entry sesuai ID praktikum dari database
const spreadsheetMap: Record<string, string> = {
	'prak-komnum-2627': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ74sWdl_4ZlM6ie_Qn4Xqg00q15jQgUv7O6oaZo8srNKupFgt7GkKkXukXiCosYymhiAf7KJM_dqtT/pubhtml?gid=1398249081&single=true',
	'prak-dsk-2627':'https://docs.google.com/spreadsheets/d/e/2PACX-1vQNVtHy4IIW_c0blks7VTyqx1mJyBH2kTv6XYk_5qg4fHAiyjeDsyG6PCjIxIiUI6TbPH57aj6Quaq3/pubhtml?gid=0&single=true',
	'prak-ik-2627': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuyRobtm5Ie_t6V0PlyHWXraSLr9-TGv66oDckCLxW_mhP2no7IIB7fHrhOThWd9M7MVKUmJKCh0KV/pubhtml?gid=0&single=true',
	'prak-dasel-2627':'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2b8D2oXvoGjTNHAUjNsupHz7WlHr32B0UXfXMLU18l6tcrBoxRoN_z2DWSqFg6LO_ON4XYE9amKWx/pubhtml?gid=1398249081&single=true',
	'prak-skd-2627':'https://docs.google.com/spreadsheets/d/e/2PACX-1vSB5u3sgVkSl05FXW-DPan1EGoNEWakxVCkckDF1iDtc4fvLIr3SQSvgUvqSSyUzX7TMVBxc7YvGeoo/pubhtml?gid=0&single=true',
	'prak-meli-2627':'https://docs.google.com/spreadsheets/d/e/2PACX-1vSnBCrCihORcXk_tx32JoVnnz3BfbV5kud-SzxF-riGETLX6Umg12_pKRNAEqDC4n-8jy52hJr4hJ8d/pubhtml'

};


export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { praktikumId } = params;

	const { data: praktikumData, error: dbError } = await supabase
		.from('list_praktikum')
		.select('id, nama_praktikum, nama_lab, semester, tahun')
		.eq('id', praktikumId)
		.single();

	if (dbError || !praktikumData) {
		throw error(404, 'Praktikum tidak ditemukan');
	}

	const spreadsheetUrl = spreadsheetMap[praktikumId] ? spreadsheetMap[praktikumId] : null;

	return {
		praktikum: praktikumData,
		spreadsheetUrl
	};
};
