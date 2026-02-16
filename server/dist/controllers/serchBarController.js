"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSearch = exports.adminSearch = void 0;
const productModel_1 = __importDefault(require("@/models/productModel"));
const user_1 = __importDefault(require("@/models/user"));
const order_1 = __importDefault(require("@/models/order"));
const adminSearch = async (req, res) => {
    const { q, type } = req.query; // q = keyword, type = products|users|orders
    if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required." });
    }
    try {
        let results = {};
        if (!type || type === "products") {
            results.products = await productModel_1.default.find({
                $or: [
                    { name: { $regex: q, $options: "i" } },
                    { brand: { $regex: q, $options: "i" } },
                    { category: { $regex: q, $options: "i" } }
                ],
            }).limit(10);
        }
        if (!type || type === "users") {
            results.users = await user_1.default.find({
                $or: [
                    { userName: { $regex: q, $options: "i" } },
                    { email: { $regex: q, $options: "i" } }
                ],
            }).limit(10);
        }
        if (!type || type === "orders") {
            results.orders = await order_1.default.find({
                $or: [
                    { orderNumber: { $regex: q, $options: "i" } }, // ✅ FIXED FIELD NAME
                    { "guestInfo.email": { $regex: q, $options: "i" } }
                ],
            }).limit(10);
        }
        res.json({
            products: results.products || [],
            users: results.users || [],
            orders: results.orders || []
        });
    }
    catch (err) {
        console.error("Admin search error:", err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};
exports.adminSearch = adminSearch;
const userSearch = async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required." });
    }
    try {
        const results = await productModel_1.default.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { brand: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } }
            ],
        }).limit(10);
        res.json({ products: results });
    }
    catch (err) {
        console.error("User search error:", err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};
exports.userSearch = userSearch;
