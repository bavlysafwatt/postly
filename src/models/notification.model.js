const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: [true, 'Recipient is required']
    },

    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required']
    },

    type: {
        type: String,
        enum: {
            values: ['like', 'comment', 'follow'],
            message: 'Notification type must be either like, comment, or follow'
        },
        required: [true, 'Type is required']
    },

    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

notificationSchema.index({
    recipient: 1,
    createdAt: -1
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;