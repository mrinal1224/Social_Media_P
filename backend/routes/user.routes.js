import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    getUserProfile,
    updateProfile,
    updateProfileImage,
    followUser,
    unfollowUser
} from "../controllers/user.controllers.js";
import isAuthenticated from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

userRoutes.post("/logout", isAuthenticated, logoutUser);
userRoutes.get("/me", isAuthenticated, getMe);

// Public profile: authentication is not required.
userRoutes.get("/profile/:username", getUserProfile);

// Profile editing belongs to the authenticated user.
userRoutes.put("/profile", isAuthenticated, updateProfile);
userRoutes.put(
    "/profile/image",
    isAuthenticated,
    upload.single("image"),
    updateProfileImage
);

// Follow relationships require an authenticated user.
userRoutes.post("/:id/follow", isAuthenticated, followUser);
userRoutes.delete("/:id/follow", isAuthenticated, unfollowUser);

export default userRoutes;
