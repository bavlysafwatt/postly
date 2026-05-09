const express = require('express');

const authController = require('./auth.controller');
const { registerSchema, loginSchema, updatePasswordSchema, updateMeSchema } = require('./auth.validation');
const validate = require('./../../middleware/validate.middleware');
const { uploadSingleFile } = require('../../middleware/upload.middleware');

const router = express.Router();

router.post('/register', uploadSingleFile('photo', 'users'), validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/update-password', authController.protect, validate(updatePasswordSchema), authController.updatePassword);

router.get('/me', authController.protect, authController.getMe);
router.patch('/update-me', authController.protect, validate(updateMeSchema), authController.updateMe);

module.exports = router;
