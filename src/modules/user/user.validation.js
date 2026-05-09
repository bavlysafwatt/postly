const Joi = require('joi');

exports.updateMeSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    photo: Joi.string().uri(),
}).or('name', 'email', 'photo');