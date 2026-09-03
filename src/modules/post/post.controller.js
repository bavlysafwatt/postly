const Post = require('./../../models/post.model');
const Like = require('./../../models/like.model');
const Comment = require('./../../models/comment.model');
const catchAsync = require('../../utils/catchAsync.utils');
const AppError = require('../../utils/AppError.utils');
const APIFeatures = require('../../utils/ApiFeatures.utils');
const attachPostMeta = require('../../utils/attachPostMeta.utils');
const notificationService = require('../notification/notification.service');

exports.createPost = catchAsync(async (req, res, next) => {
    req.body.author = req.user._id;
    req.body.photos = req.files && req.files.photos ? req.files.photos.map(file => file.path) : [];

    var newPost = await Post.create(req.body);
    newPost = await newPost.populate('author', 'name username photo');

    res.status(201).json({
        status: 'success',
        data: {
            post: newPost
        }
    });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Post.find({ author: { $ne: req.user._id } }), req.query)
        .sort()
        .limitFields()
        .paginate();

    const posts = await features.query;
    const totalResults = await Post.countDocuments({ author: { $ne: req.user._id } });
    const totalPages = Math.ceil(totalResults / features.limit);

    res.status(200).json({
        status: 'success',
        data: {
            page: features.page,
            totalPages,
            totalResults,
            hasNextPage: features.page < totalPages,
            hasPreviousPage: features.page > 1,
            posts: await attachPostMeta(posts, req.user._id)
        }
    });
});

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            post: await attachPostMeta(post, req.user._id)
        }
    });
});

exports.updatePost = catchAsync(async (req, res, next) => {
    if (req.files && req.files.photos) {
        req.body.photos = req.files.photos.map(file => file.path);
    }
    var post = await Post.findByIdAndUpdate({ _id: req.params.id, author: req.user._id }, req.body, {
        new: true,
        runValidators: true
    });

    if (!post) {
        return next(new AppError('No post found with that ID or you are not the author', 404));
    }

    post = await post.populate('author', 'name username photo');

    res.status(200).json({
        status: 'success',
        data: {
            post
        }
    });
});

exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndDelete({ _id: req.params.id, author: req.user._id });

    if (!post) {
        return next(new AppError('No post found with that ID or you are not the author', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getMyPosts = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Post.find({ author: req.user._id }), req.query)
        .sort()
        .limitFields()
        .paginate();

    const posts = await features.query;
    // Get total results and total pages for pagination
    const totalResults = await Post.countDocuments({ author: req.user._id });
    const totalPages = Math.ceil(totalResults / features.limit);

    res.status(200).json({
        status: 'success',
        data: {
            page: features.page,
            totalPages,
            totalResults,
            hasNextPage: features.page < totalPages,
            hasPreviousPage: features.page > 1,
            posts: await attachPostMeta(posts, req.user._id)
        }
    });
});

exports.getPostsByUser = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Post.find({ author: req.params.id }), req.query)
        .sort()
        .limitFields()
        .paginate();

    const posts = await features.query;
    const totalResults = await Post.countDocuments({ author: req.params.id });
    const totalPages = Math.ceil(totalResults / features.limit);

    res.status(200).json({
        status: 'success',
        data: {
            page: features.page,
            totalPages,
            totalResults,
            hasNextPage: features.page < totalPages,
            hasPreviousPage: features.page > 1,
            posts: await attachPostMeta(posts, req.user._id)
        }
    });
});

exports.likePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    const like = await Like.create({ user: req.user._id, post: req.params.id });

    // Increase like count in Post document
    post.likeCount = (post.likeCount || 0) + 1;
    await post.save();

    // Create notification for post author
    await notificationService.createNotification({
        recipient: post.author,
        sender: req.user._id,
        type: 'like',
        post: post._id
    });

    res.status(201).json({
        status: 'success',
        data: {
            like
        }
    });
});

exports.unlikePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }
    const like = await Like.findOneAndDelete({ user: req.user._id, post: req.params.id });

    if (!like) {
        return next(new AppError('No like found for this post by the user', 404));
    }

    // Decrease like count in Post document
    post.likeCount = Math.max(0, post.likeCount - 1);
    await post.save();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.addComment = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    const comment = (await Comment.create({ user: req.user._id, post: req.params.id, content: req.body.content }));

    await comment.populate('user', 'name username photo');

    // Increase comment count in Post document
    post.commentCount = (post.commentCount || 0) + 1;
    await post.save();

    // Create notification for post author
    await notificationService.createNotification({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
    });

    res.status(201).json({
        status: 'success',
        data: {
            comment
        }
    });
});

exports.getComments = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    const features = new APIFeatures(Comment.find({ post: req.params.id }), req.query)
        .sort()
        .limitFields()
        .paginate();

    const results = await features.query;
    const totalResults = await Comment.countDocuments();
    const totalPages = Math.ceil(totalResults / features.limit);

    res.status(200).json({
        status: 'success',
        data: {
            page: features.page,
            totalPages,
            totalResults,
            hasNextPage: features.page < totalPages,
            hasPreviousPage: features.page > 1,
            comments: results,
        }
    });
});