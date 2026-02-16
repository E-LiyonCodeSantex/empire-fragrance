"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const PaymentSchema = new mongoose_1.Schema({
    provider: { type: String },
    method: { type: String },
    transactionId: { type: String },
    txRef: { type: String },
    chargedAmount: { type: Number },
    currency: { type: String, default: "NGN" },
    raw: { type: mongoose_1.Schema.Types.Mixed },
    confirmedAt: { type: Date },
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: false },
    guestInfo: {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
    },
    items: [
        {
            productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            imageUrl: String,
            quantity: Number,
            price: Number,
        },
    ],
    shippingAddress: {
        recipientName: String,
        phone: String,
        email: String,
        street: String,
        nearestBustop: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    subtotal: { type: Number },
    shippingFee: { type: Number },
    total: { type: Number },
    totalAmount: { type: Number },
    currency: { type: String, default: "NGN" },
    paymentMethod: { type: String },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "awaiting_confirmation", "paid", "failed"],
        default: "unpaid"
    },
    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    deliveredAt: { type: Date },
    deliveryDate: { type: Date },
    orderNumber: { type: String, index: true, unique: true },
    notes: { type: String },
    paymentLockKey: { type: String, index: true },
    payment: { type: PaymentSchema, required: true, default: {} },
    // New field: user self‑report
    hasMadePayment: { type: Boolean, default: false },
}, { timestamps: true });
function generateOrderNumber() {
    const random = crypto_1.default.randomBytes(4).toString("hex").toUpperCase();
    return `ORD-${random}`;
}
OrderSchema.pre("save", function (next) {
    if (!this.orderNumber) {
        this.orderNumber = generateOrderNumber();
    }
    if (typeof this.total === "number" && (!this.totalAmount || this.totalAmount !== this.total)) {
        this.totalAmount = this.total;
    }
    next();
});
exports.default = (0, mongoose_1.model)("Order", OrderSchema);
