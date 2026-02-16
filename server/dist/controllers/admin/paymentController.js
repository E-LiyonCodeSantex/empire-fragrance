"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.overridePaymentStatus = exports.processBankAlert = void 0;
const order_1 = __importDefault(require("@/models/order"));
/**
 * Process a parsed bank alert and update order payment status.
 * Expected payload: { orderNumber, amount, transactionId, narration, provider }
 */
const processBankAlert = async (req, res) => {
    const { orderNumber, amount, transactionId, narration, provider } = req.body;
    if (!orderNumber || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const order = await order_1.default.findOne({ orderNumber });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Compare amounts
        if (order.total !== amount) {
            // Flag for manual review
            order.paymentStatus = "awaiting_confirmation";
            order.payment = {
                provider,
                method: "bank_transfer",
                transactionId,
                txRef: narration,
                chargedAmount: amount,
                currency: order.currency,
                raw: req.body, // keep raw payload for auditing
            };
            await order.save();
            return res.status(200).json({
                message: "Payment flagged for manual review (amount mismatch)",
                order,
            });
        }
        // ✅ Valid payment
        order.paymentStatus = "paid";
        order.hasMadePayment = true;
        order.payment = {
            provider,
            method: "bank_transfer",
            transactionId,
            txRef: narration,
            chargedAmount: amount,
            currency: order.currency,
            confirmedAt: new Date(),
            raw: req.body,
        };
        await order.save();
        return res.status(200).json({
            message: "Payment successfully recorded",
            order,
        });
    }
    catch (err) {
        console.error("processBankAlert error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.processBankAlert = processBankAlert;
// controllers/admin/paymentController.ts
const overridePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // "paid" | "failed" | "awaiting_confirmation"
    if (!["paid", "failed", "awaiting_confirmation"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    try {
        const order = await order_1.default.findById(id);
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        order.paymentStatus = status;
        if (status === "paid") {
            order.hasMadePayment = true;
            order.payment.confirmedAt = new Date();
        }
        await order.save();
        return res.status(200).json({ message: "Payment status updated", order });
    }
    catch (err) {
        console.error("overridePaymentStatus error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.overridePaymentStatus = overridePaymentStatus;
