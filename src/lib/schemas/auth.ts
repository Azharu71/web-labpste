import Joi from 'joi';

export const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'string.email': 'Format email tidak valid.',
		'string.empty': 'Email wajib diisi.',
		'any.required': 'Email wajib diisi.'
	}),
	password: Joi.string().required().messages({
		'string.empty': 'Password wajib diisi.',
		'any.required': 'Password wajib diisi.'
	})
});

export const registerSchema = Joi.object({
	nim: Joi.string()
		.pattern(/^\d{10}$/)
		.required()
		.messages({
			'string.pattern.base': 'NIM harus 10 digit.',
			'string.empty': 'NIM wajib diisi.',
			'any.required': 'NIM wajib diisi.'
		}),
	email: Joi.string().email().required().messages({
		'string.email': 'Format email tidak valid.',
		'string.empty': 'Email wajib diisi.',
		'any.required': 'Email wajib diisi.'
	}),
	password: Joi.string().required().messages({
		'string.empty': 'Password wajib diisi.',
	}),
	confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
		'any.only': 'Password dan konfirmasi password tidak cocok.',
		'any.required': 'Konfirmasi password wajib diisi.'
	})
});

export const resetPasswordRequestSchema = Joi.object({
	email: Joi.string().email({ tlds: { allow: false } }).required().messages({
		'string.email': 'Format email tidak valid.',
		'string.empty': 'Email wajib diisi.',
		'any.required': 'Email wajib diisi.'
	})
});

export const resetPasswordUpdateSchema = Joi.object({
	newPassword: Joi.string().min(6).required().messages({
		'string.min': 'Password minimal 6 karakter.',
		'string.empty': 'Password baru wajib diisi.',
		'any.required': 'Password baru wajib diisi.'
	}),
	confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
		'any.only': 'Password dan konfirmasi password tidak cocok.',
		'any.required': 'Konfirmasi password wajib diisi.'
	})
});
