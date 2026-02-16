"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminMe = exports.adminLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_1 = __importDefault(require("@/models/admin"));
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await admin_1.default.findOne({ email });
        if (!admin)
            return res.status(401).json({ message: "This is not an admin email. Please confirm and try again." });
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid Password." });
        const token = jsonwebtoken_1.default.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    }
    catch (err) {
        res.status(500).json({ message: "Server error. Please try again." });
    }
};
exports.adminLogin = adminLogin;
const getAdminMe = async (req, res) => {
    try {
        const admin = await admin_1.default.findById(req.user.id).select("-password");
        if (!admin)
            return res.status(404).json({ message: "Admin not found" });
        res.json(admin);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch admin profile" });
    }
};
exports.getAdminMe = getAdminMe;
