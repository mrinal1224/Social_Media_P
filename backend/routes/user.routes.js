import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    getUserProfile
} from "../controllers/user.controllers.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

userRoutes.post("/logout", isAuthenticated, logoutUser);
userRoutes.get("/me", isAuthenticated, getMe);

// Public profile: authentication is not required.
userRoutes.get("/profile/:username", getUserProfile);

export default userRoutes;
