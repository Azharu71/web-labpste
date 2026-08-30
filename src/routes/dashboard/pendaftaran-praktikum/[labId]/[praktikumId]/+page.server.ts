// src/routes/dashboard/pendaftaran-praktikum/[labId]/[praktikumId]/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { pendaftaranSchema } from '$lib/schemas/pendaftaran';

export const load: PageServerLoad = async ({ params, locals, parent, setHeaders }) => {
	// Prevent browser caching for this specific page to avoid showing the registration form again
	setHeaders({
		'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
		'Pragma': 'no-cache',
		'Expires': '0'
	});
	

	// Gunakan user dari parent layout — tidak perlu safeGetSession() ulang
	const parentData = await parent();
	const user = await parentData.user;
	if (!user) throw redirect(303, '/auth/login');

	const { labId, praktikumId } = params;

	// 1. Validasi praktikumId dari database (MANDATORY)
	const { data: praktikumData, error: praktikumError } = await locals.supabase
		.from('list_praktikum')
		.select('id, nama_praktikum, group_link')
		.ilike('id', `%${praktikumId}%`)
		.single();

	if (praktikumError || !praktikumData) {
		throw error(404, 'Praktikum tidak ditemukan');
	}

	// 2. Cek apakah user SUDAH terdaftar di praktikum ini
	const { data: existingReg } = await locals.supabase
		.from('daftar_praktikan')
		.select('id, full_name, nim, ipk, krs_type, praktikum_id')
		.eq('user_id', user.id)
		.eq('praktikum_id', praktikumData.id)
		.single();

	// 3. Cek Waktu Pendaftaran (Registration Window)
	const { data: timeData } = await locals.supabase
		.from('Time')
		.select('start, end')
		.order('id', { ascending: false })
		.limit(1)
		.maybeSingle();

	let isRegistrationOpen = false;
	let registrationMessage = 'Pendaftaran belum dibuka atau telah ditutup.';

	if (timeData && timeData.start) {
		const now = new Date();
		// Supabase mengembalikan ISO string UTC, JS Date mem-parsingnya ke timezone lokal secara otomatis
		const startDate = new Date(timeData.start);
		const endDate = timeData.end ? new Date(timeData.end) : null;

		if (now < startDate) {
			registrationMessage = `Pendaftaran belum dibuka. Akan dibuka pada ${startDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB.`;
		} else if (endDate && now > endDate) {
			registrationMessage = `Pendaftaran telah ditutup pada ${endDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB.`;
		} else {
			isRegistrationOpen = true;
			registrationMessage = endDate 
				? `Pendaftaran akan ditutup pada ${endDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB.` 
				: 'Pendaftaran sedang dibuka.';
		}
	}

	return {
		labId,
		praktikumId,
		// Pass realPraktikumId agar action tidak perlu query ulang
		realPraktikumId: praktikumData.id,
		praktikumName: praktikumData.nama_praktikum,
		isRegistered: !!existingReg,
		existingData: existingReg,
		groupLink: praktikumData.group_link || null,
		isRegistrationOpen,
		registrationMessage
	};
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401);

		const formData = await request.formData();
		const { praktikumId } = params;

		// 0. Cek apakah pendaftaran dibuka
		const { data: timeData } = await locals.supabase
			.from('Time')
			.select('start, end')
			.order('id', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (!timeData || !timeData.start) {
			return fail(400, { message: 'Akses ditolak: Pendaftaran ditutup atau jadwal belum diatur.' });
		}

		const now = new Date();
		const startDate = new Date(timeData.start);
		const endDate = timeData.end ? new Date(timeData.end) : null;

		if (now < startDate || (endDate && now > endDate)) {
			return fail(400, { message: 'Akses ditolak: Waktu pendaftaran tidak valid atau sudah ditutup.' });
		}

		// Ambil data form
		const fullNameRaw = formData.get('fullName') as string;
		const nim = formData.get('nim') as string;
		const ipk = formData.get('ipk') as string;
		const krsType = formData.get('krsType') as string;
		const krsFile = formData.get('krsFile') as File;
		const availableSchedule = formData.getAll('schedule');
		const keterangan = (formData.get('keterangan') as string)?.trim() || '';

		// Normalisasi: konversi nama ke UPPERCASE
		const fullName = fullNameRaw?.trim().toUpperCase();

		// Gunakan realPraktikumId dari hidden input (dikirim dari form) — tidak perlu query ulang
		const realPraktikumId =
			(formData.get('realPraktikumId') as string) ||
			// Fallback: query jika hidden input tidak ada
			(
				await locals.supabase
					.from('list_praktikum')
					.select('id')
					.ilike('id', `%${praktikumId}%`)
					.single()
			).data?.id;

		if (!realPraktikumId) return fail(404, { message: 'Praktikum tidak ditemukan' });

		// Cek apakah user SUDAH terdaftar di praktikum ini (Cek Server-Side)
		const { data: existingReg } = await locals.supabase
			.from('daftar_praktikan')
			.select('id')
			.eq('user_id', user.id)
			.eq('praktikum_id', realPraktikumId)
			.maybeSingle();

		if (existingReg) {
			return fail(400, { message: 'Anda sudah terdaftar pada praktikum ini.' });
		}

		// Validasi Input dengan Joi
		const validationResult = pendaftaranSchema.validate(
			{ fullName, nim, ipk, krsType, schedule: availableSchedule },
			{ abortEarly: false }
		);

		if (validationResult.error) {
			return fail(400, { message: validationResult.error.details[0].message });
		}

		if (!krsFile.size) {
			return fail(400, { message: 'File KRS wajib diupload' });
		}

		// 1. Upload KRS
		const fileExt = krsFile.name.split('.').pop();
		const fileName = `${nim}_${praktikumId}_${Date.now()}.${fileExt}`;

		const { error: uploadError } = await locals.supabase.storage
			.from('krs-uploads/KRS_Ganjil')
			.upload(fileName, krsFile);

		if (uploadError) return fail(500, { message: 'Gagal upload KRS' });

		const { data: urlData } = locals.supabase.storage.from('krs-uploads').getPublicUrl(fileName);

		// 2. Simpan ke daftar_praktikan
		const { data: insertData, error: dbError } = await locals.supabase
			.from('daftar_praktikan')
			.upsert({
				user_id: user.id,
				praktikum_id: realPraktikumId,
				full_name: fullName, // sudah UPPERCASE
				nim,
				ipk,
				krs_type: krsType,
				krs_url: urlData.publicUrl,
				keterangan
			})
			.select()
			.single();

		if (dbError) {
			console.error('[pendaftaran] DB error:', dbError);
			// Hapus file KRS yang sudah di-upload agar tidak jadi orphan di storage
			await locals.supabase.storage.from('krs-uploads').remove([fileName]);
			return fail(500, { message: 'Database error: ' + dbError.message });
		}

		// 3. Simpan Jadwal Kosong
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
				if (scheduleMap[dayKey]) scheduleMap[dayKey].push(shift);
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
		};

		const { error: jadwalError } = await locals.supabase.from('jadwal_kosong').insert(jadwalPayload);

		if (jadwalError) {
			console.error('[pendaftaran] Jadwal error:', jadwalError);
			// Rollback: hapus entry daftar_praktikan agar tidak terjadi data inkonsisten
			await locals.supabase.from('daftar_praktikan').delete().eq('id', insertData.id);
			return fail(500, { message: 'Gagal menyimpan jadwal: ' + jadwalError.message });
		}

		return { success: true };
	}
};
