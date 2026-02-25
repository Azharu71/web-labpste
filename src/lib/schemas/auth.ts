import Joi from 'joi';

export const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'string.email': 'Email format is invalid.',
		'string.empty': 'Email is required.',
		'any.required': 'Email is required.'
	}),
	password: Joi.string().required().messages({
		'string.empty': 'Password is required.',
		'any.required': 'Password is required.'
	})
});

export const registerSchema = Joi.object({
	nim: Joi.string()
		.pattern(/^\d{10}$/)
		.required()
		.messages({
			'string.pattern.base': 'NIM must be 10 digits.',
			'string.empty': 'NIM is required.',
			'any.required': 'NIM is required.'
		}),
	email: Joi.string().email().required().messages({
		'string.email': 'Format email is invalid.',
		'string.empty': 'Email is required.',
		'any.required': 'Email is required.'
	}),
	password: Joi.string().required().messages({
		'string.empty': 'Password is required.',
	}),
	confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
		'any.only': 'Password and confirmation password do not match.',
		'any.required': 'Confirmation password is required.'
	})
});

export const resetPasswordRequestSchema = Joi.object({
	email: Joi.string().email({ tlds: { allow: false } }).required().messages({
		'string.email': 'Format email is invalid.',
		'string.empty': 'Email is required.',
		'any.required': 'Email is required.'
	})
});

export const resetPasswordUpdateSchema = Joi.object({
	newPassword: Joi.string().min(6).required().messages({
		'string.min': 'Password must be at least 6 characters.',
		'string.empty': 'New password is required.',
		'any.required': 'New password is required.'
	}),
	confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
		'any.only': 'Password and confirmation password do not match.',
		'any.required': 'Confirmation password is required.'
	})
});
