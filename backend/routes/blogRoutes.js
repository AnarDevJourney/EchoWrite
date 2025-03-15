import express from "express";
import {
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
} from "../controllers/blogController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllBlogs).post(protect, createBlog);
router.get("/my-blogs", protect, getMyBlogs);
router.get("/search", searchBlogs);
router.get("/category/:category", getBlogsByCategory);
router.get("/pending", protect, admin, getPendingBlogs);
router
  .route("/:id")
  .get(getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);
router.put("/:id/approve", protect, admin, approveBlog);

export default router;
