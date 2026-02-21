// src/routes/dashboard/pendaftaran-praktikum/[labId]/[praktikumId]/+page.server.ts
import { log } from 'console';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { pendaftaranSchema } from '$lib/schemas/pendaftaran';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) throw redirect(303, '/auth/login');

	const { labId, praktikumId } = params;

	// 1. Validasi praktikumId dari database (MANDATORY)
	// Menggunakan Partial Match karena ID URL (e.g. 'komnum') beda dengan ID DB (e.g. 'prak-komnum-2627')
	const { data: praktikumData, error: praktikumError } = await locals.supabase
		.from('list_praktikum')
		.select('id, nama_praktikum')
		.ilike('id', `%${praktikumId}%`)
		.single();

	if (praktikumError || !praktikumData) {
		throw error(404, 'Praktikum tidak ditemukan');
	}

	const niceName = praktikumData.nama_praktikum;

	// 2. Cek apakah user SUDAH terdaftar di praktikum spesifik ini
	const { data: existingReg } = await locals.supabase
		.from('daftar_praktikan')
		.select('*')
		.eq('user_id', user.id)
		// .eq('lab_id', labId) // REMOVED: Column no longer exists
		.eq('praktikum_id', praktikumData.id) // Gunakan Real ID dari DB
		.single();

	return {
		labId,
		praktikumId,
		praktikumName: niceName,
		isRegistered: !!existingReg,
		existingData: existingReg
	};
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401);

		const formData = await request.formData();
		const { labId, praktikumId } = params; // Ambil ID dari URL

		// Ambil data form
		const fullName = formData.get('fullName') as string;
		const nim = formData.get('nim') as string;
		const ipk = formData.get('ipk') as string;
		const krsType = formData.get('krsType') as string;
		const krsFile = formData.get('krsFile') as File;
		const availableSchedule = formData.getAll('schedule');

		// Validasi Input dengan Joi
		const validationResult = pendaftaranSchema.validate(
			{
				fullName,
				nim,
				ipk,
				krsType,
				schedule: availableSchedule
			},
			{ abortEarly: false }
		);

		if (validationResult.error) {
			const firstError = validationResult.error.details[0].message;
			return fail(400, { message: firstError });
		}

		if (!krsFile.size) {
			return fail(400, { message: 'File KRS wajib diupload' });
		}

        // 0. Resolve Real ID (Fix ID mismatch)
		const { data: praktikumData } = await locals.supabase
			.from('list_praktikum')
			.select('id')
			.ilike('id', `%${praktikumId}%`)
			.single();
        
        if (!praktikumData) return fail(404, { message: 'Praktikum tidak ditemukan di sistem' });
        const realPraktikumId = praktikumData.id;

		// 1. Upload KRS
		const fileExt = krsFile.name.split('.').pop();
		const fileName = `${nim}_${praktikumId}_${Date.now()}.${fileExt}`;

		const { error: uploadError } = await locals.supabase.storage
			.from('krs-uploads')
			.upload(fileName, krsFile);

		if (uploadError) return fail(500, { message: 'Gagal upload KRS' });

		const { data: urlData } = locals.supabase.storage.from('krs-uploads').getPublicUrl(fileName);

		// 2. Simpan ke Database
		// Update table: daftar_praktikan
		const { data: insertData, error: dbError } = await locals.supabase.from('daftar_praktikan').upsert({
			user_id: user.id,
			// lab_id: labId, // REMOVED: No longer valid column
			praktikum_id: realPraktikumId, // Use Real ID resolved above
			full_name: fullName,
			nim: nim,
			ipk: ipk,
			krs_type: krsType,
			krs_url: urlData.publicUrl
			// available_schedule: availableSchedule // REMOVED: Moved to separate table
		}).select().single();

		if (dbError) {
			log(dbError);
			return fail(500, { message: 'Database error: ' + dbError.message });
		}

		// 3. Simpan Jadwal Kosong
		// Transform schedule array ["Senin_1", "Selasa_2"] -> { senin: ["1"], selasa: ["2"] }
		const scheduleMap: Record<string, string[]> = {
			senin: [],
			selasa: [],
			rabu: [],
			kamis: [],
			jumat: [],
			sabtu: [],
			minggu: []
		};

		availableSchedule.forEach((item) => {
			if (typeof item === 'string') {
				const [day, shift] = item.split('_');
				const dayKey = day.toLowerCase();
				if (scheduleMap[dayKey]) {
					scheduleMap[dayKey].push(shift);
				}
			}
		});

		const jadwalPayload = {
			id: insertData.id,
			senin: scheduleMap.senin.length ? JSON.stringify(scheduleMap.senin) : null,
			selasa: scheduleMap.selasa.length ? JSON.stringify(scheduleMap.selasa) : null,
			rabu: scheduleMap.rabu.length ? JSON.stringify(scheduleMap.rabu) : null,
			kamis: scheduleMap.kamis.length ? JSON.stringify(scheduleMap.kamis) : null,
			jumat: scheduleMap.jumat.length ? JSON.stringify(scheduleMap.jumat) : null,
			sabtu: scheduleMap.sabtu.length ? JSON.stringify(scheduleMap.sabtu) : null,
			minggu: scheduleMap.minggu.length ? JSON.stringify(scheduleMap.minggu) : null
		};

		const { error: jadwalError } = await locals.supabase
			.from('jadwal_kosong')
			.insert(jadwalPayload);

		if (jadwalError) {
			log(jadwalError);
			// Optional: Rollback daftar_praktikan if needed, or just fail
			return fail(500, { message: 'Gagal menyimpan jadwal: ' + jadwalError.message });
		}

		return { success: true };
	}
};
