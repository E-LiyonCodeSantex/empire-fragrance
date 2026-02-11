import mongoose, { Schema, Document } from "mongoose";

export interface ShippingRuleDocument extends Document {
  state: string;              // e.g. "Lagos"
  price: number;              // e.g. 2000
  freeShippingThreshold?: number; // e.g. 50000 (optional)
}

const ShippingRuleSchema = new Schema<ShippingRuleDocument>(
  {
    state: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    freeShippingThreshold: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<ShippingRuleDocument>("ShippingRule", ShippingRuleSchema);
