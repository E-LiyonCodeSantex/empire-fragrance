import mongoose, { Schema, Document } from "mongoose";

export interface ProductCardProps extends Document {
  name: string;
  description?: string;
  price: number; // stored in minor units (e.g., cents/kobo)
  imageUrl: string;
  rating?: number; // 0–5
  isAvailable: boolean;
  salePrice?: number;
  tags?: string[];
  brand?: string;
  category?: string;
  quantity: number;
  sku?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    isAvailable: { type: Boolean, default: true },
    salePrice: { type: Number },
    tags: { type: [String], default: [] },
    brand: { type: String },
    category: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    sku: { type: String },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0},
  },
  { timestamps: true }
);

export default mongoose.model<ProductCardProps>("Product", ProductSchema);
