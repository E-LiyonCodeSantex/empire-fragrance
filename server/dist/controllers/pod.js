"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPodPayment = confirmPodPayment;
const order_1 = __importDefault(require("@/models/order"));
async function confirmPodPayment(req, res) {
    try {
        const { orderId } = req.params;
        const { method } = req.body; // "cash" | "transfer"
        const order = await order_1.default.findOne({ orderNumber: orderId });
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        if (order.paymentStatus === "paid") {
            return res.json({ message: "Already paid", order });
        }
        order.paymentStatus = "paid";
        order.orderStatus = "processing";
        order.payment = {
            provider: "pod",
            method,
            chargedAmount: order.totalAmount,
            currency: order.currency || process.env.CURRENCY || "NGN",
            raw: { agent: req.user?.id, method },
            confirmedAt: new Date(),
        };
        order.deliveryDate = new Date(); // or computeDeliveryDate() if you ship later
        await order.save();
        return res.json({ message: "POD payment confirmed", order });
    }
    catch (err) {
        return res.status(500).json({ message: "Error confirming POD payment" });
    }
}
