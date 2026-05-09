const Like = require('../models/like.model');
const Bookmark = require('../models/bookmark.model');

const attachPostMeta = async (posts, userId) => {
    // Convert single post to array
    const postsArray = Array.isArray(posts) ? posts : [posts];

    const postIds = postsArray.map(post => post._id);

    // Get likes
    const likes = await Like.find({
        user: userId,
        post: { $in: postIds }
    });

    // Get bookmarks
    const bookmarks = await Bookmark.find({
        user: userId,
        post: { $in: postIds }
    });

    // Convert to Sets for O(1) lookup
    const likedPostIds = new Set(
        likes.map(like => like.post.toString())
    );

    const bookmarkedPostIds = new Set(
        bookmarks.map(bookmark => bookmark.post.toString())
    );

    // Attach flags
    const modifiedPosts = postsArray.map(post => {
        const postObj = post.toObject();

        postObj.isLiked = likedPostIds.has(post._id.toString());

        postObj.isBookmarked = bookmarkedPostIds.has(
            post._id.toString()
        );

        return postObj;
    });

    return Array.isArray(posts)
        ? modifiedPosts
        : modifiedPosts[0];
};

module.exports = attachPostMeta;