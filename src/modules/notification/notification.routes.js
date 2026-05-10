const express = require('express');
const notificationController = require('./notification.controller');
const authController = require('../auth/auth.controller');

const router = express.Router();

router.use(authController.protect);

router.get('/', notificationController.getNotifications);

router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);

module.exports = router;