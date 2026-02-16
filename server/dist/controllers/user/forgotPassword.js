"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.userResetPassword = exports.userVerifyCode = exports.userForgotPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("@/models/user"));
// Step 1: Forgot Password
const userForgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await user_1.default.findOne({
        email: email.toLowerCase(),
    });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const code = crypto_1.default.randomInt(100000, 999999).toString();
    user.resetCode = code.toString();
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Code from Empire Fragrance.",
        html: `<p>Your reset code is <b>${code}</b>. It expires in 10 minutes.</p>`,
    });
    res.json({ message: "Reset code sent" });
};
exports.userForgotPassword = userForgotPassword;
// Step 2: Verify Code
const userVerifyCode = async (req, res) => {
    const { email, code } = req.body;
    const user = await user_1.default.findOne({
        email: email.toLowerCase(),
        resetCode: code.toString(),
        resetCodeExpires: { $gt: new Date() },
    });
    if (!user)
        return res.status(400).json({ message: "Invalid or expired code. Please request a new code." });
    res.json({ message: "Code verified" });
};
exports.userVerifyCode = userVerifyCode;
// Step 3: Reset Password
const userResetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    const user = await user_1.default.findOne({
        email: email.toLowerCase(),
        resetCode: code.toString(),
        resetCodeExpires: { $gt: new Date() },
    });
    if (!user)
        return res.status(400).json({ message: "Invalid or expired code" });
    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
};
exports.userResetPassword = userResetPassword;
const updateUserProfile = async (req, res) => {
    const { newUserName, newEmail, currentPassword } = req.body;
    try {
        const userId = req.user.id; // from JWT middleware
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // ✅ Confirm password
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password. Update denied." });
        }
        // ✅ Apply updates
        if (newUserName)
            user.userName = newUserName;
        if (newEmail)
            user.email = newEmail.toLowerCase();
        await user.save();
        return res.json({
            message: "Profile updated successfully.",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error("Update profile error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};
exports.updateUserProfile = updateUserProfile;
