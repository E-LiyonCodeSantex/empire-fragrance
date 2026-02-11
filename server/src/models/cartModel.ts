// models/cartModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface CartItem {
    _id?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface CartDocument extends Document {
    
  userId?: mongoose.Types.ObjectId | null;
  token?: string | null; // for guest carts
  items: CartItem[];
}

const CartItemSchema = new Schema<CartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: true }
);

const CartSchema = new Schema<CartDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    token: { type: String, index: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<CartDocument>("Cart", CartSchema);
