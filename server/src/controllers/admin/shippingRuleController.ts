import { Request, Response } from "express";
import ShippingRule from "@/models/shippingModel";

// Create rule
export const createRule = async (req: Request, res: Response) => {
  try {
    const { state, price, freeShippingThreshold } = req.body;
    const rule = new ShippingRule({ state, price, freeShippingThreshold });
    await rule.save();
    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ message: "Failed to create rule", error: err });
  }
};

// Get all rules
export const getRules = async (_req: Request, res: Response) => {
  try {
    const rules = await ShippingRule.find().sort({ state: 1 });
    res.status(200).json(rules);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rules", error: err });
  }
};

// Update rule
export const updateRule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { state, price, freeShippingThreshold } = req.body;
    const rule = await ShippingRule.findByIdAndUpdate(
      id,
      { state, price, freeShippingThreshold },
      { new: true }
    );
    if (!rule) return res.status(404).json({ message: "Rule not found" });
    res.status(200).json(rule);
  } catch (err) {
    res.status(500).json({ message: "Failed to update rule", error: err });
  }
};

// Delete rule
export const deleteRule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rule = await ShippingRule.findByIdAndDelete(id);
    if (!rule) return res.status(404).json({ message: "Rule not found" });
    res.status(200).json({ message: "Rule deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete rule", error: err });
  }
};