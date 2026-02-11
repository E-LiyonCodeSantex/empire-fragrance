import mongoose, { Schema, Document } from "mongoose";

export interface ReviewDocument extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number; // 1–5
  comment?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ReviewDocument>("Review", ReviewSchema);
