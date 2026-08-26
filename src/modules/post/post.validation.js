const Joi = require('joi');

exports.createPostSchema = Joi.object({
    content: Joi.string().min(10).required(),
    photos: Joi.array().items(Joi.string().uri()),
});

exports.updatePostSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
    content: Joi.string().min(10),
    photos: Joi.array().items(Joi.string().uri()),
});

exports.getPostSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

exports.deletePostSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

exports.likePostSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

exports.unlikePostSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

exports.addCommentSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
    content: Joi.string().min(1).required(),
});

exports.getCommentsSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

