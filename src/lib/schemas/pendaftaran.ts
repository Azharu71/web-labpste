import Joi from 'joi';

export const pendaftaranSchema = Joi.object({
	fullName: Joi.string().required().messages({
		'string.empty': 'Nama Lengkap harus diisi',
		'any.required': 'Nama Lengkap harus diisi'
	}),
	nim: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'NIM harus berupa 10 digit angka.',
		'string.empty': 'NIM harus diisi',
		'any.required': 'NIM harus diisi'
	}),
	ipk: Joi.string().pattern(/^([0-3](\.\d{1,2})?|4(\.0{1,2})?)$/).required().messages({
		'string.pattern.base': 'IPK harus menggunakan titik (contoh: 3.50) dan maksimal 4.00',
		'string.empty': 'IPK harus diisi',
		'any.required': 'IPK harus diisi'
	}),
	krsType: Joi.string().valid('regular', 'manual').required().messages({
		'any.only': 'Tipe KRS tidak valid',
		'any.required': 'Tipe KRS harus dipilih'
	}),
	schedule: Joi.alternatives().try(
		Joi.array().items(Joi.string()).min(1),
		Joi.string()
	).required().messages({
		'array.min': 'Pilih minimal satu jadwal',
		'any.required': 'Pilih minimal satu jadwal'
	})
});
