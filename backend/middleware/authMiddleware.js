import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    const error = new Error("Not authorized, no token");
    error.status = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    next();
  } catch (error) {
    const authError = new Error("Not authorized, token failed");
    authError.status = 401;
    return next(authError);
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    const error = new Error("Not authorized as an admin");
    error.status = 401;
    return next(error);
  }
};

export { protect, admin };
