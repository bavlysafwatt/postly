const express = require('express');

const authController = require('./auth.controller');
const { registerSchema, loginSchema, updatePasswordSchema, forgotPasswordSchema, resetPasswordSchema } = require('./auth.validation');
const validate = require('./../../middleware/validate.middleware');
const { uploadSingleFile } = require('../../middleware/upload.middleware');

const router = express.Router();

router.post('/register', uploadSingleFile('photo', 'users'), validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/update-password', authController.protect, validate(updatePasswordSchema), authController.updatePassword);

// Update and reset password routes
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
