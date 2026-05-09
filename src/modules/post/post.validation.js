const Joi = require('joi');

exports.createPostSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(10).required(),
    photos: Joi.array().items(Joi.string().uri()),
});

exports.updatePostSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    content: Joi.string().min(10),
    photos: Joi.array().items(Joi.string().uri()),
});

exports.getPostSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

exports.deletePostSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

