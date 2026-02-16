"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.updatePreferences = exports.updatePassword = exports.savePayment = exports.getPayments = exports.getUserOrders = exports.getMe = void 0;
const order_1 = __importDefault(require("@/models/order"));
const user_1 = __importDefault(require("@/models/user"));
const PaymentMethod_1 = __importDefault(require("@/models/PaymentMethod"));
//-------------Get me  --------------------
const getMe = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await user_1.default.findById(req.user.id).select("-password -__v");
        if (!user) {
            return res.status(401).json({ message: "User not found. Please log in again." });
        }
        return res.status(200).json(user);
    }
    catch (err) {
        console.error("Error in getMe:", err);
        return res.status(500).json({ message: "It's not you, it's us. Please try again." });
    }
};
exports.getMe = getMe;
// -------------------- ORDERS --------------------
const getUserOrders = async (req, res) => {
    try {
        const orders = await order_1.default.find({ user: req.user.id });
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserOrders = getUserOrders;
// -------------------- PAYMENTS --------------------
const getPayments = async (req, res) => {
    const methods = await PaymentMethod_1.default.find({ user: req.user.id });
    res.json(methods);
};
exports.getPayments = getPayments;
const savePayment = async (req, res) => {
    const method = new PaymentMethod_1.default({ ...req.body, user: req.user.id });
    await method.save();
    res.json(method);
};
exports.savePayment = savePayment;
// -------------------- SECURITY --------------------
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await user_1.default.findById(req.user.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
        return res.status(400).json({ message: "Invalid current password" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
};
exports.updatePassword = updatePassword;
// -------------------- PREFERENCES --------------------
const updatePreferences = async (req, res) => {
    const { emailNotifications, smsNotifications, theme } = req.body;
    const user = await user_1.default.findByIdAndUpdate(req.user.id, { preferences: { emailNotifications, smsNotifications, theme } }, { new: true });
    res.json(user?.preferences);
};
exports.updatePreferences = updatePreferences;
// -------------------- LOGOUT --------------------
const logout = async (_req, res) => {
    res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
