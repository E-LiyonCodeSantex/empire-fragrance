"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopProducts = exports.getOrdersTrend = exports.getUserById = exports.getAllUsers = exports.getDashboardStats = void 0;
const user_1 = __importDefault(require("@/models/user"));
const productModel_1 = __importDefault(require("@/models/productModel"));
const order_1 = __importDefault(require("@/models/order"));
const contact_1 = __importDefault(require("@/models/contact"));
const review_1 = __importDefault(require("@/models/review"));
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await user_1.default.countDocuments();
        const totalProducts = await productModel_1.default.countDocuments();
        const totalOrders = await order_1.default.countDocuments();
        const totalRevenueAgg = await order_1.default.aggregate([
            { $match: { orderStatus: "delivered" } },
            { $group: { _id: null, total: { $sum: "$total" } } },
        ]);
        const totalRevenue = totalRevenueAgg[0]?.total || 0;
        const pendingOrders = await order_1.default.countDocuments({ orderStatus: "pending" });
        const processingOrders = await order_1.default.countDocuments({ orderStatus: "processing" });
        const shippedOrders = await order_1.default.countDocuments({ orderStatus: "shipped" });
        const deliveredOrders = await order_1.default.countDocuments({ orderStatus: "delivered" });
        const resolvedMessages = await contact_1.default.countDocuments({ status: "resolved" });
        const pendingMessages = await contact_1.default.countDocuments({ status: "pending" });
        const totalReviews = await review_1.default.countDocuments();
        res.json({
            users: totalUsers,
            products: totalProducts,
            orders: totalOrders,
            revenue: totalRevenue,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            resolvedMessages,
            pendingMessages,
            reviews: totalReviews,
        });
    }
    catch (err) {
        console.error("Error fetching dashboard stats:", err);
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
};
exports.getDashboardStats = getDashboardStats;
// ✅ Get all users (name + email)
const getAllUsers = async (req, res) => {
    try {
        const users = await user_1.default.find({}, "userName email createdAt").sort({ createdAt: -1 });
        res.json(users);
    }
    catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (err) {
        console.error("Get user by ID error:", err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};
exports.getUserById = getUserById;
const getOrdersTrend = async (req, res) => {
    try {
        // Group orders by month
        const trend = await order_1.default.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } },
        ]);
        // Map months to labels
        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const data = labels.map((_, i) => {
            const found = trend.find((t) => t._id === i + 1);
            return found ? found.count : 0;
        });
        res.json({ labels, data });
    }
    catch (err) {
        console.error("Error fetching orders trend:", err);
        res.status(500).json({ message: "Failed to fetch orders trend" });
    }
};
exports.getOrdersTrend = getOrdersTrend;
const getTopProducts = async (req, res) => {
    try {
        const topProducts = await order_1.default.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    totalSold: { $sum: "$items.quantity" },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    name: "$product.name",
                    totalSold: 1,
                },
            },
        ]);
        console.log("DEBUG: Top products aggregation result:", topProducts);
        res.json(topProducts);
    }
    catch (err) {
        console.error("Error fetching top products:", err);
        res.status(500).json({ message: "Failed to fetch top products" });
    }
};
exports.getTopProducts = getTopProducts;
