const User = require('../../models/user.model');
const catchAsync = require('../../utils/catchAsync.utils');
const AppError = require('../../utils/AppError.utils');

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-__v');

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

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-__v');
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});