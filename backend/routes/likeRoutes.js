import express from "express";
import {
  likePost,
  unlikePost,
  getLikesForPost,
  checkIfUserLikedPost,
} from "../controllers/likeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, likePost);
router.delete("/:id", protect, unlikePost);
router.get("/:blogId", getLikesForPost);
router.get("/check/:blogId", protect, checkIfUserLikedPost);

export default router;
