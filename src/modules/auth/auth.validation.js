const Joi = require('joi');

exports.registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    photo: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match password',
    }),
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

exports.updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
    passwordConfirm: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Confirm new password must match new password',
    }),
});