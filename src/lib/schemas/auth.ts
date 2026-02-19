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
			'string.pattern.base': 'NIM harus berupa 10 digit angka.',
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
		'any.required': 'Password wajib diisi.'
	}),
	confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
		'any.only': 'Password dan konfirmasi password tidak cocok.',
		'any.required': 'Konfirmasi password wajib diisi.'
	})
});
