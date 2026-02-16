"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const user_1 = __importDefault(require("@/models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loginUser = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const user = await user_1.default.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "User not registered. Sign up first." });
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: rememberMe ? "30d" : "1h",
    });
    res.json({
        success: true,
        message: "Login successful!",
        token,
        user: { id: user._id, email: user.email },
    });
};
exports.loginUser = loginUser;
