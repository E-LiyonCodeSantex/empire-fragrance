import { Request, Response } from "express";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not registered. Sign up first." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, 
    process.env.JWT_SECRET!, {
    expiresIn: rememberMe ? "30d" : "1h",
  });

  res.json({
    success: true,
    message: "Login successful!",
    token,
    user: { id: user._id, email: user.email },
  });
};
