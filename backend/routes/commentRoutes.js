import express from "express";
import {
  createComment,
  getCommentsForBlog,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/:blogId", getCommentsForBlog);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;
