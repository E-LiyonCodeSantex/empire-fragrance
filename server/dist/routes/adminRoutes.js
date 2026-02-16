"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("@/controllers/admin/login");
const forgotPassword_1 = require("@/controllers/admin/forgotPassword");
const productController_1 = require("@/controllers/admin/productController");
const validateRegister_1 = require("@/middleware/validateRegister");
const orderController_1 = require("@/controllers/orderController");
const paymentController_1 = require("@/controllers/admin/paymentController");
const adminDashboardController_1 = require("@/controllers/admin/adminDashboardController");
const shippingRuleController_1 = require("@/controllers/admin/shippingRuleController");
const reviewController_1 = require("@/controllers/reviewController");
const contactController_1 = require("@/controllers/contactController");
const adminDashboardController_2 = require("@/controllers/admin/adminDashboardController");
const serchBarController_1 = require("@/controllers/serchBarController");
const router = (0, express_1.Router)();
router.get("/dashboard", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, adminDashboardController_1.getDashboardStats);
router.get("/users", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, adminDashboardController_1.getAllUsers);
router.get("/users/:id", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, adminDashboardController_1.getUserById);
router.post('/login', login_1.adminLogin);
router.get("/me", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, login_1.getAdminMe);
// Forgot Password routes
router.post("/forgot-password", forgotPassword_1.adminForgotPassword);
router.post("/verify-code", forgotPassword_1.adminVerifyCode);
router.post("/reset-password", forgotPassword_1.adminResetPassword);
router.put("/update", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, forgotPassword_1.adminUpdateProfile);
router.post("/products", productController_1.addProduct);
router.get("/products", productController_1.getProducts);
router.get("/products/:id", productController_1.getProductById);
// Reviews routes
router.get("/reviews", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, reviewController_1.getAllReviews);
//admin search rout
router.get("/search", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, serchBarController_1.adminSearch);
// Orders routes
// Admin: update order status
router.get("/orders/all", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, orderController_1.getAllOrders);
// Admin: get order by ID
router.get("/orders/:id", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, orderController_1.getOrderById);
// Admin: update payment status
router.put("/orders/:id/payment-status", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, orderController_1.adminUpdatePaymentStatus);
// Admin: update order delivery status
router.put("/orders/:id/order-delivery-status", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, orderController_1.adminUpdateOrderStatus);
// Admin: update shipping status
router.put("/orders/:id/order-shipping-status", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, orderController_1.adminUpdateShippingStatus);
// Admin: update cancel status
router.put("/orders/:id/order-cancel-status", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, orderController_1.adminUpdateCancelStatus);
// Payment routes
router.post("/payments/bank-alert", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, paymentController_1.processBankAlert);
router.patch("/payments/:id/admin-confirm-status", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, paymentController_1.overridePaymentStatus);
// Shipping Rules routes
router.post("/shipping-rules", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, shippingRuleController_1.createRule);
router.get("/shipping-rules", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, shippingRuleController_1.getRules);
router.put("/shipping-rules/:id", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, shippingRuleController_1.updateRule);
router.delete("/shipping-rules/:id", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, shippingRuleController_1.deleteRule);
// Admin routes
router.get("/messages", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, contactController_1.getMessages);
router.patch("/messages/:id/resolve", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, contactController_1.resolveMessage);
// Dashboard analytics routes
router.get("/dashboard/orders-trend", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, adminDashboardController_2.getOrdersTrend);
router.get("/dashboard/top-products", validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, adminDashboardController_2.getTopProducts);
exports.default = router;
