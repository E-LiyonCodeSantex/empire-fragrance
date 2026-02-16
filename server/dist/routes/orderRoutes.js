"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("@/controllers/orderController");
const validateRegister_1 = require("@/middleware/validateRegister"); // ensure req.user is set
const router = express_1.default.Router();
// Create new order
router.post("/create", validateRegister_1.authMiddleware, orderController_1.createOrder);
router.post("/guest-create", orderController_1.guestCreateOrder);
// Mark awaiting bank transfer
router.patch("/:id/payment-status", orderController_1.updatePaymentStatus);
// Get all orders for logged-in user
router.get("/", validateRegister_1.optionalAuthMiddleware, orderController_1.getUserOrders);
// Get single order
router.get("/:id", orderController_1.getOrderById);
router.post("/calculate-shipping", orderController_1.calculateShipping);
exports.default = router;
