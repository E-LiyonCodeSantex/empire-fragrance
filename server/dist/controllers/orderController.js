"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateShipping = exports.adminUpdateCancelStatus = exports.adminUpdateShippingStatus = exports.adminUpdateOrderStatus = exports.adminUpdatePaymentStatus = exports.getOrderById = exports.getUserOrders = exports.getAllOrders = exports.updatePaymentStatus = exports.guestCreateOrder = exports.createOrder = void 0;
const order_1 = __importDefault(require("@/models/order"));
const shippingModel_1 = __importDefault(require("@/models/shippingModel"));
const productModel_1 = __importDefault(require("@/models/productModel"));
// Create new order
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, shippingFee, subtotal, total, paymentMethod, notes } = req.body;
        const userId = req.user.id;
        const order = new order_1.default({
            user: userId,
            items,
            shippingAddress,
            shippingFee,
            subtotal,
            total,
            paymentMethod,
            paymentStatus: "unpaid",
            orderStatus: "pending",
            notes,
        });
        await order.save();
        res.status(201).json(order);
    }
    catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Failed to create order", err });
    }
};
exports.createOrder = createOrder;
// Create order for guest checkout
const guestCreateOrder = async (req, res) => {
    try {
        const { items, shippingAddress, shippingFee, subtotal, total, paymentMethod, guestInfo, notes } = req.body;
        const order = new order_1.default({
            guestInfo,
            items,
            shippingAddress,
            shippingFee,
            subtotal,
            total,
            paymentMethod,
            paymentStatus: "unpaid",
            orderStatus: "pending",
            notes,
        });
        await order.save();
        res.status(201).json(order);
    }
    catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Failed to create order", err });
    }
};
exports.guestCreateOrder = guestCreateOrder;
// PATCH /api/orders/:id/payment-status
const updatePaymentStatus = async (req, res) => {
    try {
        const order = await order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found. Please try again later." });
        }
        const { paymentStatus } = req.body;
        if (!["unpaid", "awaiting_confirmation", "paid", "failed"].includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }
        order.paymentStatus = paymentStatus;
        order.hasMadePayment = paymentStatus === "awaiting_confirmation";
        if (paymentStatus === "paid") {
            order.payment.confirmedAt = new Date();
        }
        await order.save();
        res.json(order);
    }
    catch (err) {
        console.error("Error updating payment status:", err);
        res.status(500).json({ message: "Failed to update payment status" });
    }
};
exports.updatePaymentStatus = updatePaymentStatus;
//GET all orders 
const getAllOrders = async (req, res) => {
    try {
        const orders = await order_1.default.find().populate("user", "name email");
        res.status(200).json(orders);
    }
    catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};
exports.getAllOrders = getAllOrders;
// Get all orders for logged-in user and guest by email
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const guestEmail = req.query.email;
        if (!userId && !guestEmail) {
            return res.status(400).json({ message: "Missing user context. please refresh the page and try again." });
        }
        const query = [];
        if (userId) {
            query.push({ user: userId });
        }
        if (guestEmail) {
            query.push({ "guestInfo.email": guestEmail });
        }
        const orders = await order_1.default.find({ $or: query })
            .populate("user", "userName email") // ✅ populate safe fields
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    }
    catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};
exports.getUserOrders = getUserOrders;
// Get single order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await order_1.default.findById(id).populate("user", "userName email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    }
    catch (err) {
        console.error("getOrderById error:", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};
exports.getOrderById = getOrderById;
// Update payment status
const adminUpdatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "paid" | "failed" | "awaiting_confirmation"
        if (!["paid", "failed", "awaiting_confirmation"].includes(status)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }
        const order = await order_1.default.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.paymentStatus = status;
        await order.save();
        if (status === "paid" && order.items && order.items.length > 0) {
            for (const item of order.items) {
                if (!item.quantity || item.quantity <= 0)
                    continue; // skip invalid quantities
                const product = await productModel_1.default.findById(item.productId);
                if (product) {
                    product.quantity = Math.max(product.quantity - item.quantity, 0);
                    await product.save();
                }
            }
        }
        res.json({ message: "Payment status updated successfully", order });
    }
    catch (err) {
        console.error("Error updating payment status:", err);
        res.status(500).json({ message: "Failed to update payment status" });
    }
};
exports.adminUpdatePaymentStatus = adminUpdatePaymentStatus;
// Update order status (delivery)
const adminUpdateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "delivered" | "not delivered"
        if (!["delivered", "not delivered"].includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        const order = await order_1.default.findByIdAndUpdate(id, { orderStatus: status, deliveredAt: status === "delivered" ? new Date() : null }, { new: true });
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update order status", error: err });
    }
};
exports.adminUpdateOrderStatus = adminUpdateOrderStatus;
// ✅ Controller for Shipping checkbox
const adminUpdateShippingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // expected: "shipped" or "processing"
        if (!["shipped", "processing"].includes(status)) {
            return res.status(400).json({ message: "Invalid shipping status" });
        }
        const order = await order_1.default.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update shipping status", error: err });
    }
};
exports.adminUpdateShippingStatus = adminUpdateShippingStatus;
// ✅ Controller for Cancel checkbox
const adminUpdateCancelStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // expected: "cancelled" or "processing"
        if (!["cancelled", "processing"].includes(status)) {
            return res.status(400).json({ message: "Invalid cancel status" });
        }
        const order = await order_1.default.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update cancel status", error: err });
    }
};
exports.adminUpdateCancelStatus = adminUpdateCancelStatus;
// Calculate shipping fee
const calculateShipping = async (req, res) => {
    try {
        const { subtotal, state } = req.body;
        const defaultPrice = 2000;
        const rule = await shippingModel_1.default.findOne({ state });
        let fee = defaultPrice;
        if (rule) {
            if (rule.freeShippingThreshold && subtotal >= rule.freeShippingThreshold) {
                fee = 0;
            }
            else {
                fee = rule.price;
            }
        }
        res.status(200).json({ fee });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to calculate shipping", error: err });
    }
};
exports.calculateShipping = calculateShipping;
