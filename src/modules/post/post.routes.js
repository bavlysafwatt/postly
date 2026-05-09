const express = require('express');

const authController = require('./../auth/auth.controller');
const postController = require('./post.controller');
const { createPostSchema, updatePostSchema, getPostSchema, deletePostSchema } = require('./post.validation');
const validate = require('./../../middleware/validate.middleware');
const { uploadMultipleFiles } = require('../../middleware/upload.middleware');

const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(postController.getAllPosts)
    .post(uploadMultipleFiles([{ name: 'photos', maxCount: 5 }], 'posts'), validate(createPostSchema), postController.createPost);

router.route('/:id')
    .get(validate(getPostSchema), postController.getPost)
    .patch(uploadMultipleFiles([{ name: 'photos', maxCount: 5 }], 'posts'), validate(updatePostSchema), postController.updatePost)
    .delete(validate(deletePostSchema), postController.deletePost);

module.exports = router;