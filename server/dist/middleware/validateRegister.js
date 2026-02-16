"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.optionalAuthMiddleware = exports.authMiddleware = exports.validateRegister = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ✅ Registration validation middleware
const validateRegister = (req, res, next) => {
    const { userName, email, password, confirmPassword, termsAccepted } = req.body;
    if (!userName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }
    if (!termsAccepted) {
        return res.status(400).json({ message: "Terms must be accepted." });
    }
    next();
};
exports.validateRegister = validateRegister;
// ✅ Auth middleware: verifies JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "This page requires you to  login." });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        res.locals.user = req.user;
        next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // no token → guest 
        return next();
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        res.locals.user = req.user;
    }
    catch (err) {
        // invalid token → treat as guest 
        console.warn("Invalid token, continuing as guest");
    }
    next();
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
// ✅ Role-based middleware: requires admin
const requireAdmin = (req, res, next) => {
    const user = req.user || res.locals.user;
    if (!user || user.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied for users: Admins only" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
