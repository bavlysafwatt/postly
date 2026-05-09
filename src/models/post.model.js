const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the post!'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please provide content for the post!']
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide an author for the post!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    photos: [String],
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    }
});

postSchema.pre(/^find/, function () {
    this.populate({
        path: 'author',
        select: 'name username photo'
    });
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;