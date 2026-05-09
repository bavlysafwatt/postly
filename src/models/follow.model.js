const mongoose = require('mongoose');
const { path } = require('../../app');

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a follower!']
    },
    following: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a following!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;