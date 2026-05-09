const AppError = require('../utils/AppError.utils');

export const validate = (schema) => {
    return (req, res, next) => {
        let filter = {};

        if (req.file) {
            filter = {
                photo: req.file.path,
                ...req.body,
                ...req.params
            };
        }

        else if (req.files) {
            filter = {
                photo: req.files.photo
                    ? req.files.photo[0].path
                    : undefined,

                photos: req.files.photos
                    ? req.files.photos.map(file => file.path)
                    : [],

                ...req.body,
                ...req.params
            };
        }

        else {
            filter = {
                ...req.body,
                ...req.params
            };
        }

        const { error } = schema.validate(filter, { abortEarly: false });

        if (!error) {
            return next();
        }

        const errorMessages = error.details.map(err => err.message);
        next(new AppError(errorMessages.join(', '), 400));
    };
};