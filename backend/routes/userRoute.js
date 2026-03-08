import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserProfile, adminLogin, listUsers, addUser, removeUser, updateUser, getAdminProfile, updateAdminProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import multer from 'multer';

// Image Storage Engine for Avatar Uploads
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage: storage})

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

// Admin Profile endpoints
userRouter.get("/admin-profile", getAdminProfile);
userRouter.post("/admin-update", upload.single("image"), updateAdminProfile);

export default userRouter;