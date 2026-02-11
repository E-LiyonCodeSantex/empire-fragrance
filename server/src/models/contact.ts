import mongoose, { Schema, Document } from "mongoose";

export interface ContactDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "pending" | "resolved";
  resolvedAt: { type: Date }
  createdAt: Date;
}

const ContactSchema = new Schema<ContactDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    phone: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<ContactDocument>("Contact", ContactSchema);
