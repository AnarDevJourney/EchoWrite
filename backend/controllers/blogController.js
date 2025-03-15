import asyncHandler from "../middleware/asyncHandler.js";
import BlogPost from "../models/blogPostModel.js";

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = asyncHandler(async (req, res, next) => {
  const { title, content, category, tags } = req.body;

  if (!title || !content || !category) {
    const error = new Error("Please provide title, content, and category");
    error.status = 400;
    return next(error);
  }

  const blogPost = await BlogPost.create({
    title,
    content,
    author: req.user._id,
    category,
    tags,
  });

  if (blogPost) {
    res.status(201).json(blogPost);
  } else {
    const error = new Error("Invalid blog data");
    error.status = 400;
    return next(error);
  }
});

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await BlogPost.find({}).populate("author", "name email");

  if (blogs) {
    res.status(200).json(blogs);
  } else {
    const error = new Error("No blogs found");
    error.status = 404;
    return next(error);
  }
});

// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id).populate(
    "author",
    "name email"
  );

  if (blog) {
    blog.views += 1;
    await blog.save();
    res.status(200).json(blog);
  } else {
    const error = new Error("Blog not found");
    error.status = 404;
    return next(error);
  }
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = asyncHandler(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);

  if (!blog) {
    const error = new Error("Blog not found");
    error.status = 404;
    return next(error);
  }

  if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    const error = new Error("Not authorized to update this blog");
    error.status = 403;
    return next(error);
  }

  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;
  blog.category = req.body.category || blog.category;
  blog.tags = req.body.tags || blog.tags;

  const updatedBlog = await blog.save();

  res.status(200).json(updatedBlog);
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);

  if (!blog) {
    const error = new Error("Blog not found");
    error.status = 404;
    return next(error);
  }

  if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    const error = new Error("Not authorized to update this blog");
    error.status = 403;
    return next(error);
  }

  await BlogPost.deleteOne({ _id: blog._id });

  res.status(200).json({ message: "Blog deleted" });
});

// @desc    Get logged in user's blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
const getMyBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await BlogPost.find({ author: req.user._id }).populate(
    "author",
    "name email"
  );

  if (blogs) {
    res.status(200).json(blogs);
  } else {
    const error = new Error("No blogs found for this user");
    error.status = 404;
    return next(error);
  }
});

// @desc    Approve a blog post
// @route   PUT /api/blogs/:id/approve
// @access  Private/Admin
const approveBlog = asyncHandler(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);

  if (!blog) {
    const error = new Error("Blog not found");
    error.status = 404;
    return next(error);
  }

  if (blog.status === "approved") {
    const error = new Error("Blog is already approved");
    error.status = 404;
    return next(error);
  }

  blog.status = "approved";
  const updatedBlog = await blog.save();

  res.status(200).json(updatedBlog);
});

// @desc    Get all pending blogs
// @route   GET /api/blogs/pending
// @access  Private/Admin
const getPendingBlogs = asyncHandler(async (req, res, next) => {
  const pendingBlogs = await BlogPost.find({ status: "pending" }).populate(
    "author",
    "name email"
  );

  if (pendingBlogs) {
    res.status(200).json(pendingBlogs);
  } else {
    const error = new Error("No pending blogs found");
    error.status = 404;
    return next(error);
  }
});

// @desc    Get blogs by category
// @route   GET /api/blogs/category/:category
// @access  Public
const getBlogsByCategory = asyncHandler(async (req, res, next) => {
  const blogs = await BlogPost.find({ category: req.params.category }).populate(
    "author",
    "name email"
  );

  if (blogs) {
    res.status(200).json(blogs);
  } else {
    const error = new Error("No blogs found in this category");
    error.status = 404;
    return next(error);
  }
});

// @desc    Search blogs by title or content
// @route   GET /api/blogs/search
// @access  Public
const searchBlogs = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    const error = new Error("Please provide a search query");
    error.status = 400;
    return next(error);
  }

  const blogs = await BlogPost.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ],
  }).populate("author", "name email");

  if (blogs) {
    res.status(200).json(blogs);
  } else {
    const error = new Error("No blogs found");
    error.status = 404;
    return next(error);
  }
});

export {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  approveBlog,
  getPendingBlogs,
  getBlogsByCategory,
  searchBlogs,
};
