const Notification = require('./../../models/notification.model');

exports.createNotification = async ({
    recipient,
    sender,
    type,
    post = null,
}) => {

    if (recipient.toString() === sender.toString()) {
        return;
    }

    return await Notification.create({
        recipient,
        sender,
        type,
        post,
    });
};