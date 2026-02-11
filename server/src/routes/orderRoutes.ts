import express from "express";
import {
  createOrder,
  guestCreateOrder,
  updatePaymentStatus,
  getUserOrders,
  getOrderById,
  calculateShipping,
} from "@/controllers/orderController";
import { authMiddleware, optionalAuthMiddleware } from "@/middleware/validateRegister"; // ensure req.user is set

const router = express.Router();

// Create new order
router.post("/create", authMiddleware, createOrder);
router.post("/guest-create", guestCreateOrder);

// Mark awaiting bank transfer
router.patch("/:id/payment-status", updatePaymentStatus);

// Get all orders for logged-in user
router.get("/", optionalAuthMiddleware, getUserOrders);

// Get single order
router.get("/:id", getOrderById);

router.post("/calculate-shipping", calculateShipping);



export default router;
