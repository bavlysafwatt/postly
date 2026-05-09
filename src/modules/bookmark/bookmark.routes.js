const express = require('express');

const authController = require('../auth/auth.controller');
const bookmarkController = require('./bookmark.controller');
const { createBookmarkSchema, deleteBookmarkSchema } = require('./bookmark.validation');
const validate = require('./../../middleware/validate.middleware');

const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(bookmarkController.getMyBookmarks)
    .post(validate(createBookmarkSchema), bookmarkController.createBookmark);

router.delete('/:id', validate(deleteBookmarkSchema), bookmarkController.deleteBookmark);

module.exports = router;