const multer = require('multer');
const cloudinary = require('../../cloudinary');
const AppError = require('../utils/AppError.utils');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed!', 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});

const uploadToCloudinary = async (file, folderName) => {
    const base64 = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
        folder: `${process.env.APP_NAME}/${folderName}`
    });

    return result;
};

exports.uploadSingleFile = (fieldName, folderName) => [
    upload.single(fieldName),

    async (req, res, next) => {
        try {
            if (!req.file) return next();

            const result = await uploadToCloudinary(req.file, folderName);

            req.file.filename = result.public_id;
            req.file.path = result.secure_url;

            next();
        } catch (err) {
            next(err);
        }
    }
];

exports.uploadMultipleFiles = (fields, folderName) => [
    upload.fields(fields),

    async (req, res, next) => {
        try {
            if (!req.files) return next();

            for (const fieldName in req.files) {
                const files = req.files[fieldName];

                for (const file of files) {
                    const result = await uploadToCloudinary(file, folderName);

                    file.filename = result.public_id;
                    file.path = result.secure_url;
                }
            }

            next();
        } catch (err) {
            next(err);
        }
    }
];