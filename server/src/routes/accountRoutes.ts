import { Router } from "express";
import { authMiddleware } from "@/middleware/validateRegister";
import {
  getMe,
  getUserOrders,
  getPayments,
  savePayment,
  updatePassword,
  updatePreferences,
  logout,
} from "@/controllers/user/accountController";

const router = Router();

router.get("/user/me", authMiddleware, getMe);

router.get("/orders/mine", authMiddleware, getUserOrders);

router.get("/payments", authMiddleware, getPayments);
router.post("/payments", authMiddleware, savePayment);

router.post("/user/password", authMiddleware, updatePassword);
router.put("/user/preferences", authMiddleware, updatePreferences);

router.post("/auth/logout", authMiddleware, logout);

export default router;
