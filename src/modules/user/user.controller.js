const User = require('../../models/user.model');
const Follow = require('../../models/follow.model');
const catchAsync = require('../../utils/catchAsync.utils');
const AppError = require('../../utils/AppError.utils');

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-__v');

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true
    }).select('-__v');

    if (!updatedUser) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-__v');

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    // Check if the current user is following this user
    const isFollowing = !!(await Follow.exists({ follower: req.user._id, following: req.params.id }));

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                ...user.toObject(),
                isFollowing
            }
        }
    });
});

exports.followUser = catchAsync(async (req, res, next) => {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
        return next(new AppError('No user found with that ID', 404));
    }

    const follow = await Follow.create({
        follower: req.user._id,
        following: req.params.id
    });

    // Increment followers and following count
    userToFollow.followers += 1;
    await userToFollow.save();

    req.user.following += 1;
    await req.user.save();

    res.status(201).json({
        status: 'success',
        data: {
            follow
        }
    });
});

exports.unfollowUser = catchAsync(async (req, res, next) => {
    const follow = await Follow.findOneAndDelete({
        follower: req.user._id,
        following: req.params.id
    });

    if (!follow) {
        return next(new AppError('You are not following this user', 404));
    }

    // Decrement followers and following count
    const userToUnfollow = await User.findById(req.params.id);
    userToUnfollow.followers = Math.max(0, userToUnfollow.followers - 1);
    await userToUnfollow.save();

    req.user.following = Math.max(0, req.user.following - 1);
    await req.user.save();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getMyFollowers = catchAsync(async (req, res, next) => {
    const followers = await Follow.find({ following: req.user._id }).populate('follower', 'name username photo');

    res.status(200).json({
        status: 'success',
        data: {
            followers
        }
    });
});

exports.getMyFollowing = catchAsync(async (req, res, next) => {
    const following = await Follow.find({ follower: req.user._id }).populate('following', 'name username photo');

    res.status(200).json({
        status: 'success',
        data: {
            following
        }
    });
});

exports.getFollowersByUser = catchAsync(async (req, res, next) => {
    const followers = await Follow.find({ following: req.params.id }).populate('follower', 'name username photo');

    res.status(200).json({
        status: 'success',
        data: {
            followers
        }
    });
});

exports.getFollowingByUser = catchAsync(async (req, res, next) => {
    const following = await Follow.find({ follower: req.params.id }).populate('following', 'name username photo');
    res.status(200).json({
        status: 'success',
        data: {
            following
        }
    });
});
