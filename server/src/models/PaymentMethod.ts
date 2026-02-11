import { Schema, model, Document, Types } from "mongoose";

export interface IPaymentItem {
  product: Types.ObjectId;
  qty: number;
  price: number;
}

export interface IPayment extends Document {
  user: Types.ObjectId;
  items: IPaymentItem[];
  total: number;
  status: "pending" | "completed" | "failed";
  placedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
export default model<IPayment>("Payment", PaymentSchema);
