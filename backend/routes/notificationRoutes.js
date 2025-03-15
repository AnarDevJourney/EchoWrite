import express from "express";
import {
  createNotification,
  getUserNotifications,
  deleteNotification,
  markNotificationAsRead,
  getUnreadNotifications,
} from "../controllers/notificationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createNotification);
router.get("/:userId", protect, getUserNotifications);
router.delete("/:id", protect, deleteNotification);
router.put("/:id/read", protect, markNotificationAsRead);
router.get("/:userId/unread", protect, getUnreadNotifications);

export default router;
