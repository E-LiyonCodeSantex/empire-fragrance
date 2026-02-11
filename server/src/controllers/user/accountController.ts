import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/validateRegister";
import Order from "@/models/order";
import User from "@/models/user";
import PaymentMethod from "@/models/PaymentMethod";
import bcrypt from "bcryptjs";

//-------------Get me  --------------------
export const getMe = async (req: AuthRequest, res: Response) =>{
  try {
    if(!req.user?.id) {
      return res.status(401).json({message: "Unauthorized"});
    }
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user){
      return res.status(401).json({message: "User not found. Please log in again."});
    }
    return res.status(200).json(user);
  } catch (err){
    console.error("Error in getMe:", err);
    return res.status(500).json({message: "It's not you, it's us. Please try again."});
  }
};

// -------------------- ORDERS --------------------
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




// -------------------- PAYMENTS --------------------
export const getPayments = async (req: AuthRequest, res: Response) => {
  const methods = await PaymentMethod.find({ user: req.user.id });
  res.json(methods);
};


export const savePayment = async (req: AuthRequest, res: Response) => {
  const method = new PaymentMethod({ ...req.body, user: req.user.id });
  await method.save();
  res.json(method);
};


// -------------------- SECURITY --------------------
export const updatePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return res.status(400).json({ message: "Invalid current password" });

  user.password = newPassword;
  await user.save();
  res.json({ message: "Password updated successfully" });
};


// -------------------- PREFERENCES --------------------
export const updatePreferences = async (req: AuthRequest, res: Response) => {
  const { emailNotifications, smsNotifications, theme } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { preferences: { emailNotifications, smsNotifications, theme } },
    { new: true }
  );
  res.json(user?.preferences);
};

// -------------------- LOGOUT --------------------
export const logout = async (_req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
};
