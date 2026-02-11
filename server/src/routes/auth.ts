import { Router } from 'express';
import { registerUser } from '../controllers/user/authController';
import { validateRegister } from '../middleware/validateRegister';
import { loginUser } from "../controllers/user/userLoginController";
import { userForgotPassword, userVerifyCode, userResetPassword, updateUserProfile } from "@/controllers/user/forgotPassword";
import { userSearch } from "@/controllers/serchBarController";
import { createMessage } from "@/controllers/contactController";
import { authMiddleware } from "@/middleware/validateRegister";

const router = Router();

router.post('/register', validateRegister, registerUser);

router.post('/login', (req, res, next) => {
    console.log("Login route hit with body:", req.body);
    next();
}, loginUser);



router.post("/forgot-password", userForgotPassword); 
router.post("/verify-code", userVerifyCode); 
router.post("/reset-password", userResetPassword);
router.put("/update", authMiddleware, updateUserProfile);

router.get("/search", userSearch);

// User route
router.post("/contact", createMessage);

export default router;