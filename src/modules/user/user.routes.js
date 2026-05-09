const express = require('express');

const authController = require('../auth/auth.controller');
const userController = require('./user.controller');
const postController = require('../post/post.controller');
const { updateMeSchema } = require('./user.validation');
const validate = require('./../../middleware/validate.middleware');
const { uploadSingleFile } = require('../../middleware/upload.middleware');

const router = express.Router();

router.use(authController.protect);

router.patch('/update-me', uploadSingleFile('photo', 'users'), validate(updateMeSchema), userController.updateMe);

router.get('/me', userController.getMe);
router.get('/:id', userController.getUser);

router.get('/me/posts', postController.getMyPosts);
router.get('/:id/posts', postController.getPostsByUser);

// Followers and Following
router.post('/:id/follow', userController.followUser);
router.delete('/:id/unfollow', userController.unfollowUser);

router.get('/me/followers', userController.getMyFollowers);
router.get('/me/following', userController.getMyFollowing);
router.get('/:id/followers', userController.getFollowersByUser);
router.get('/:id/following', userController.getFollowingByUser);

module.exports = router;