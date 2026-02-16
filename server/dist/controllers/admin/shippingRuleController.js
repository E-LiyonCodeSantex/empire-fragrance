"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRule = exports.updateRule = exports.getRules = exports.createRule = void 0;
const shippingModel_1 = __importDefault(require("@/models/shippingModel"));
// Create rule
const createRule = async (req, res) => {
    try {
        const { state, price, freeShippingThreshold } = req.body;
        const rule = new shippingModel_1.default({ state, price, freeShippingThreshold });
        await rule.save();
        res.status(201).json(rule);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create rule", error: err });
    }
};
exports.createRule = createRule;
// Get all rules
const getRules = async (_req, res) => {
    try {
        const rules = await shippingModel_1.default.find().sort({ state: 1 });
        res.status(200).json(rules);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch rules", error: err });
    }
};
exports.getRules = getRules;
// Update rule
const updateRule = async (req, res) => {
    try {
        const { id } = req.params;
        const { state, price, freeShippingThreshold } = req.body;
        const rule = await shippingModel_1.default.findByIdAndUpdate(id, { state, price, freeShippingThreshold }, { new: true });
        if (!rule)
            return res.status(404).json({ message: "Rule not found" });
        res.status(200).json(rule);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update rule", error: err });
    }
};
exports.updateRule = updateRule;
// Delete rule
const deleteRule = async (req, res) => {
    try {
        const { id } = req.params;
        const rule = await shippingModel_1.default.findByIdAndDelete(id);
        if (!rule)
            return res.status(404).json({ message: "Rule not found" });
        res.status(200).json({ message: "Rule deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to delete rule", error: err });
    }
};
exports.deleteRule = deleteRule;
