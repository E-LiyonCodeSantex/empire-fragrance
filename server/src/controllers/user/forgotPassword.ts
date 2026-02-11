import { Request, Response } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/user";

// Step 1: Forgot Password
export const userForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ 
    email: email.toLowerCase(),
   });
  if (!user) return res.status(404).json({ message: "User not found" });

  const code = crypto.randomInt(100000, 999999).toString();
  user.resetCode = code.toString();
  user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save();

  const transporter = nodemailer.createTransport({
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

// Step 2: Verify Code
export const userVerifyCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const user = await User.findOne({ 
    email: email.toLowerCase(), 
    resetCode: code.toString(), 
    resetCodeExpires: { $gt: new Date() }, 
  });
  if (!user) return res.status(400).json({ message: "Invalid or expired code. Please request a new code." });
  res.json({ message: "Code verified" });
};

// Step 3: Reset Password
export const userResetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ 
    email: email.toLowerCase(), 
    resetCode: code.toString(), 
    resetCodeExpires: { $gt: new Date() },
   });

  if (!user) return res.status(400).json({ message: "Invalid or expired code" });

  user.password = newPassword;
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { newUserName, newEmail, currentPassword } = req.body;

  try {
    const userId = (req as any).user.id; // from JWT middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Confirm password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password. Update denied." });
    }

    // ✅ Apply updates
    if (newUserName) user.userName = newUserName;
    if (newEmail) user.email = newEmail.toLowerCase();

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
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
