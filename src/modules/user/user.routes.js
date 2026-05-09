const express = require('express');

const authController = require('../auth/auth.controller');
const userController = require('./user.controller');
const { updateMeSchema } = require('./user.validation');
const validate = require('./../../middleware/validate.middleware');
const { uploadSingleFile } = require('../../middleware/upload.middleware');

const router = express.Router();

router.use(authController.protect);

router.get('/me', userController.getMe);
router.patch('/update-me', uploadSingleFile('photo', 'users'), validate(updateMeSchema), userController.updateMe);

router.get('/:id', userController.getUser);

module.exports = router;