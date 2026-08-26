const Bookmark = require('./../../models/bookmark.model');
const Post = require('./../../models/post.model');
const catchAsync = require('../../utils/catchAsync.utils');
const AppError = require('../../utils/AppError.utils');

exports.createBookmark = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.body.post);
    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    req.body.user = req.user._id;
    const newBookmark = await Bookmark.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            bookmark: newBookmark
        }
    });
});

exports.getMyBookmarks = catchAsync(async (req, res, next) => {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate({
        path: 'post',
        select: 'title content author createdAt photos'
    });

    res.status(200).json({
        status: 'success',
        data: {
            results: bookmarks.length,
            bookmarks
        }
    });
});

exports.deleteBookmark = catchAsync(async (req, res, next) => {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!bookmark) {
        return next(new AppError('No bookmark found with that ID or you are not the owner', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});