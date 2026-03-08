import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserProfile, adminLogin, listUsers, addUser, removeUser, updateUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.post("/update", authMiddleware, updateUserProfile);
userRouter.post("/admin-login", adminLogin);

// Admin Customer endpoints
userRouter.get("/list", listUsers);
userRouter.post("/add", addUser);
userRouter.post("/remove", removeUser);
userRouter.post("/update-admin", updateUser);

export default userRouter;