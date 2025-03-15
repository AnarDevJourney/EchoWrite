import asyncHandler from "../middleware/asyncHandler.js";
import Comment from "../models/commentModel.js";

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res, next) => {
  const { blogPost, content } = req.body;

  if (!blogPost || !content) {
    const error = new Error("Please provide blogPost ID and content");
    error.status = 400;
    return next(error);
  }

  const comment = await Comment.create({
    blogPost,
    author: req.user._id,
    content,
  });

  if (comment) {
    res.status(201).json(comment);
  } else {
    const error = new Error("Invalid comment data");
    error.status = 400;
    return next(error);
  }
});

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
// @access  Public
const getCommentsForBlog = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ blogPost: req.params.blogId }).populate(
    "author",
    "name email"
  );

  if (comments) {
    res.status(200).json(comments);
  } else {
    const error = new Error("No comments found");
    error.status = 404;
    return next(error);
  }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    return next(error);
  }

  if (
    comment.author.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    const error = new Error("Not authorized to delete this comment");
    error.status = 403;
    return next(error);
  }

  await Comment.deleteOne({ _id: comment._id });
  res.status(200).json({ message: "Comment deleted" });
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    return next(error);
  }

  if (
    comment.author.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    const error = new Error("Not authorized to update this comment");
    error.status = 403;
    return next(error);
  }

  comment.content = req.body.content || comment.content;

  const updatedComment = await comment.save();

  res.status(200).json(updatedComment);
});

export { createComment, getCommentsForBlog, deleteComment, updateComment };
