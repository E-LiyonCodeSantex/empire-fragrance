"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const user_1 = __importDefault(require("@/models/user"));
const registerUser = async (req, res) => {
    try {
        const { userName, email, password, termsAccepted } = req.body;
        const existingUser = await user_1.default.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }
        const newUser = new user_1.default({
            userName,
            email,
            password,
            termsAccepted,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
};
exports.registerUser = registerUser;
