const Notification = require('./../../models/notification.model');
const catchAsync = require('../../utils/catchAsync.utils');
const AppError = require('../../utils/AppError.utils');
const ApiFeatures = require('../../utils/ApiFeatures.utils');

exports.getNotifications = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Notification.find({ recipient: req.user._id }).populate('sender', 'username name photo'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const notifications = await features.query;

    res.status(200).json({
        status: 'success',
        length: notifications.length,
        data: {
            notifications
        }
    });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        return next(new AppError('No notification found with that ID for the current user', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            notification
        }
    });
});

exports.markAllAsRead = catchAsync(async (req, res, next) => {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });

    res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read'
    });
});