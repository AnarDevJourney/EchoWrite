import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/notificationModel.js";

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res, next) => {
  const { user, message } = req.body;

  if (!user || !message) {
    const error = new Error("Please provide user ID and message");
    error.status = 400;
    return next(error);
  }

  const notification = await Notification.create({
    user,
    message,
  });

  if (notification) {
    res.status(200).json(notification);
  } else {
    const error = new Error("Invalid notification data");
    error.status = 404;
    return next(error);
  }
});

// @desc    Get notifications for a user
// @route   GET /api/notifications/:userId
// @access  Private
const getUserNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.params.userId });

  if (notifications.length !== 0) {
    res.status(200).json(notifications);
  } else {
    const error = new Error("No notifications found");
    error.status = 404;
    return next(error);
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    const error = new Error("Notification not found");
    error.status = 404;
    return next(error);
  }

  if (
    notification.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    const error = new Error("Not authorized to delete this notification");
    error.status = 403;
    return next(error);
  }

  await Notification.deleteOne({ _id: notification._id });

  res.status(200).json({ message: "Notification deleted" });
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    const error = new Error("Notification not found");
    error.status = 404;
    return next(error);
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to mark this notification as read");
    error.status = 403;
    return next(error);
  }

  notification.read = true;

  const updatedNotification = await notification.save();

  res.status(200).json(updatedNotification);
});

// @desc    Get unread notifications for a user
// @route   GET /api/notifications/:userId/unread
// @access  Private
const getUnreadNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({
    user: req.params.userId,
    read: false,
  });

  if (notifications) {
    res.status(200).json(notifications);
  } else {
    const error = new Error("No unread notifications found");
    error.status = 404;
    return next(error);
  }
});

export {
  createNotification,
  getUserNotifications,
  deleteNotification,
  markNotificationAsRead,
  getUnreadNotifications,
};
