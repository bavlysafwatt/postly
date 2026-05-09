const express = require('express');

const authController = require('./../auth/auth.controller');
const postController = require('./post.controller');
const { createPostSchema, updatePostSchema, getPostSchema, deletePostSchema, likePostSchema, unlikePostSchema, addCommentSchema, getCommentsSchema } = require('./post.validation');
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

// Likes
router.post('/:id/like', validate(likePostSchema), postController.likePost);
router.post('/:id/unlike', validate(unlikePostSchema), postController.unlikePost);


//Comments
router.post('/:id/comment', validate(addCommentSchema), postController.addComment);
router.get('/:id/comments', validate(getCommentsSchema), postController.getComments);

module.exports = router;