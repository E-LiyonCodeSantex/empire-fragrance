"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/user/authController");
const validateRegister_1 = require("../middleware/validateRegister");
const userLoginController_1 = require("../controllers/user/userLoginController");
const forgotPassword_1 = require("@/controllers/user/forgotPassword");
const serchBarController_1 = require("@/controllers/serchBarController");
const contactController_1 = require("@/controllers/contactController");
const validateRegister_2 = require("@/middleware/validateRegister");
const router = (0, express_1.Router)();
router.post('/register', validateRegister_1.validateRegister, authController_1.registerUser);
router.post('/login', (req, res, next) => {
    console.log("Login route hit with body:", req.body);
    next();
}, userLoginController_1.loginUser);
router.post("/forgot-password", forgotPassword_1.userForgotPassword);
router.post("/verify-code", forgotPassword_1.userVerifyCode);
router.post("/reset-password", forgotPassword_1.userResetPassword);
router.put("/update", validateRegister_2.authMiddleware, forgotPassword_1.updateUserProfile);
router.get("/search", serchBarController_1.userSearch);
// User route
router.post("/contact", contactController_1.createMessage);
exports.default = router;
