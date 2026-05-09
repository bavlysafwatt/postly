const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'Please provide a post to bookmark!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user who bookmarked the post!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

bookmarkSchema.index({ post: 1, user: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;