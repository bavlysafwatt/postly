const Joi = require('joi');

exports.createBookmarkSchema = Joi.object({
    post: Joi.string().hex().length(24).required(),
});

exports.deleteBookmarkSchema = Joi.object({
    post: Joi.string().hex().length(24).required(),
});

