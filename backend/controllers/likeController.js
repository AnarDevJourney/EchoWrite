import asyncHandler from "../middleware/asyncHandler.js";
import Like from "../models/likeModel.js";

// @desc    Like a blog post
// @route   POST /api/likes
// @access  Private
const likePost = asyncHandler(async (req, res, next) => {
  const { blogPost } = req.body;

  if (!blogPost) {
    const error = new Error("Please provide a blog post ID");
    error.status = 400;
    return next(error);
  }

  const existingLike = await Like.findOne({ blogPost, user: req.user._id });

  if (existingLike) {
    const error = new Error("You have already liked this post");
    error.status = 400;
    return next(error);
  }

  const like = await Like.create({
    blogPost,
    user: req.user._id,
  });

  if (like) {
    res.status(201).json(like);
  } else {
    const error = new Error("Invalid like data");
    error.status = 400;
    return next(error);
  }
});

// @desc    Unlike a blog post
// @route   DELETE /api/likes/:id
// @access  Private
const unlikePost = asyncHandler(async (req, res, next) => {
  const like = await Like.findById(req.params.id);

  if (!like) {
    const error = new Error("Like not found");
    error.status = 404;
    return next(error);
  }

  if (like.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    const error = new Error("Not authorized to unlike this post");
    error.status = 403;
    return next(error);
  }

  await Like.deleteOne({ _id: like._id });
  res.status(200).json({ message: "Post unliked" });
});

// @desc    Get likes for a blog post
// @route   GET /api/likes/:blogId
// @access  Public
const getLikesForPost = asyncHandler(async (req, res, next) => {
  const likes = await Like.find({ blogPost: req.params.blogId }).populate(
    "user",
    "name email"
  );

  if (likes.length !== 0) {
    res.status(200).json(likes);
  } else {
    const error = new Error("No likes found for this post");
    error.status = 404;
    return next(error);
  }
});

// @desc    Check if user liked a blog post
// @route   GET /api/likes/check/:blogId
// @access  Private
const checkIfUserLikedPost = asyncHandler(async (req, res, next) => {
  const like = await Like.findOne({
    blogPost: req.params.blogId,
    user: req.user._id,
  });

  if (like) {
    res.status(200).json({ liked: true, likeId: like._id });
  } else {
    res.status(200).json({ liked: false });
  }
});

export { likePost, unlikePost, getLikesForPost, checkIfUserLikedPost };
