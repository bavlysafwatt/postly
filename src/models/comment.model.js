const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please provide content for the comment!']
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'Please provide a post for the comment!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user for the comment!']
    }
});

commentSchema.pre(/^find/, function () {
    this.populate({
        path: 'user',
        select: 'name username photo -email'
    });
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;