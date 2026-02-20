import { Request, Response } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Admin from "@/models/admin";
import bcrypt from "bcryptjs";

// Step 1: Forgot Password
export const adminForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ 
    email: email.toLowerCase(),
  });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const code = crypto.randomInt(100000, 999999).toString();
  admin.resetCode = code.toString();
  admin.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await admin.save();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT!),
    secure: process.env.EMAIL_SECURE === "true",
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    },
  });

  await transporter.sendMail({
    to: admin.email,
    subject: "Admin Password Reset Code from Empire Fragrance",
    html: `<p>Your reset code is <b>${code}</b>. It expires in 10 minutes.</p>`,
  });

  res.json({ message: "Reset code sent" });
};

// Step 2: Verify Code
export const adminVerifyCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const admin = await Admin.findOne({ 
    email: email.toLowerCase(), 
    resetCode: code.toString(), 
    resetCodeExpires: { $gt: new Date() }, 
  });
  
  if (!admin) {
    return res.status(400).json({ message: "Code not found or expired. Please request a new one." });
  }
  res.json({ message: "Code verified" });
};

// Step 3: Reset Password
export const adminResetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  
  const admin = await Admin.findOne({ 
    email: email.toLowerCase(), 
    resetCode: code.toString(), 
    resetCodeExpires: { $gt: new Date() },
   });

  if (!admin) {
    return res.status(400).json({ message: "Code not found or expired. Please request a new one." });
  }

  admin.password = newPassword;
  admin.resetCode = undefined;
  admin.resetCodeExpires = undefined;
  await admin.save();

  res.json({ message: "Password reset successful" });
};

export const adminUpdateProfile = async (req: Request, res: Response) => {
  const { newUserName, newEmail, currentPassword } = req.body;

  try {
    const adminId = (req as any).user.id; // ✅ use req.user.id
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password. Update denied." });
    }

    if (newUserName) admin.userName = newUserName;
    if (newEmail) admin.email = newEmail.toLowerCase();

    await admin.save();

    return res.json({
      message: "Profile updated successfully.",
      account: {
        id: admin._id,
        userName: admin.userName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
