"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMessage = exports.getMessages = exports.createMessage = void 0;
const contact_1 = __importDefault(require("@/models/contact"));
// ✅ User submits a message
const createMessage = async (req, res) => {
    try {
        const { name, email, subject, phone, message } = req.body;
        const newMessage = await contact_1.default.create({ name, email, subject, phone, message });
        res.status(201).json(newMessage);
    }
    catch (err) {
        console.error("Error creating message:", err);
        res.status(500).json({ message: "Failed to submit message" });
    }
};
exports.createMessage = createMessage;
// ✅ Admin fetches all messages 
const getMessages = async (req, res) => {
    try {
        // Before returning, clean up resolved messages older than 30 days 
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        await contact_1.default.deleteMany({
            status: "resolved",
            updatedAt: { $lte: thirtyDaysAgo },
        });
        const messages = await contact_1.default.find().sort({ createdAt: -1 });
        res.json(messages);
    }
    catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};
exports.getMessages = getMessages;
// ✅ Admin marks message as resolved
const resolveMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await contact_1.default.findByIdAndUpdate(id, { status: "resolved", resolvedAt: new Date() }, { new: true });
        res.json(updated);
    }
    catch (err) {
        console.error("Error resolving message:", err);
        res.status(500).json({ message: "Failed to resolve message" });
    }
};
exports.resolveMessage = resolveMessage;
