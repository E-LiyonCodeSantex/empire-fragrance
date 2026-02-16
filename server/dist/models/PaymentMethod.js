"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    placedAt: { type: Date, default: Date.now },
}, { timestamps: true });
// ✅ Prevent OverwriteModelError
exports.default = (0, mongoose_1.model)("Payment", PaymentSchema);
