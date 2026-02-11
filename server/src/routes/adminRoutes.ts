import { Router } from 'express';
import { adminLogin, getAdminMe } from "@/controllers/admin/login";
import { adminForgotPassword, adminVerifyCode, adminResetPassword, adminUpdateProfile } from "@/controllers/admin/forgotPassword";
import { addProduct, getProducts, getProductById } from "@/controllers/admin/productController";
import { authMiddleware, requireAdmin } from "@/middleware/validateRegister";
import { getAllOrders, getOrderById, adminUpdateOrderStatus, adminUpdatePaymentStatus, adminUpdateShippingStatus, adminUpdateCancelStatus } from "@/controllers/orderController";
import { processBankAlert, overridePaymentStatus} from "@/controllers/admin/paymentController";
import { getDashboardStats, getAllUsers, getUserById } from "@/controllers/admin/adminDashboardController";
import { createRule, getRules, updateRule, deleteRule } from "@/controllers/admin/shippingRuleController";
import { getAllReviews } from "@/controllers/reviewController";
import { getMessages, resolveMessage } from "@/controllers/contactController";
import { getOrdersTrend, getTopProducts } from "@/controllers/admin/adminDashboardController";
import { adminSearch } from "@/controllers/serchBarController";


const router = Router();

router.get("/dashboard", authMiddleware, requireAdmin, getDashboardStats);

router.get("/users", authMiddleware, requireAdmin, getAllUsers );
router.get("/users/:id", authMiddleware, requireAdmin, getUserById);

router.post('/login', adminLogin);
router.get("/me", authMiddleware, requireAdmin, getAdminMe);

// Forgot Password routes
router.post("/forgot-password", adminForgotPassword); 
router.post("/verify-code", adminVerifyCode); 
router.post("/reset-password", adminResetPassword);
router.put("/update", authMiddleware, requireAdmin, adminUpdateProfile);


router.post("/products", addProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// Reviews routes
router.get("/reviews", authMiddleware, requireAdmin, getAllReviews);

//admin search rout
router.get("/search", authMiddleware, requireAdmin, adminSearch);


// Orders routes
// Admin: update order status
router.get("/orders/all", authMiddleware, requireAdmin, getAllOrders);

// Admin: get order by ID
router.get("/orders/:id", authMiddleware, requireAdmin, getOrderById);

// Admin: update payment status
router.put("/orders/:id/payment-status", authMiddleware, requireAdmin, adminUpdatePaymentStatus);

// Admin: update order delivery status
router.put("/orders/:id/order-delivery-status", authMiddleware, requireAdmin, adminUpdateOrderStatus);

// Admin: update shipping status
router.put("/orders/:id/order-shipping-status", authMiddleware, requireAdmin, adminUpdateShippingStatus);

// Admin: update cancel status
router.put("/orders/:id/order-cancel-status", authMiddleware, requireAdmin, adminUpdateCancelStatus);

// Payment routes
router.post("/payments/bank-alert", authMiddleware, requireAdmin, processBankAlert);
router.patch("/payments/:id/admin-confirm-status", authMiddleware, requireAdmin, overridePaymentStatus);

// Shipping Rules routes
router.post("/shipping-rules", authMiddleware, requireAdmin, createRule);
router.get("/shipping-rules", authMiddleware, requireAdmin, getRules);
router.put("/shipping-rules/:id", authMiddleware, requireAdmin, updateRule);
router.delete("/shipping-rules/:id", authMiddleware, requireAdmin, deleteRule);

// Admin routes
router.get("/messages", authMiddleware, requireAdmin, getMessages);
router.patch("/messages/:id/resolve", authMiddleware, requireAdmin, resolveMessage);

// Dashboard analytics routes
router.get("/dashboard/orders-trend", authMiddleware, requireAdmin, getOrdersTrend); 
router.get("/dashboard/top-products", authMiddleware, requireAdmin, getTopProducts);

export default router;