import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  userName: string;
  email: string;
  password: string;
  role: string;
  // 🔑 Fields for password reset (code-based)
  resetCode?: string;
  resetCodeExpires?: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    // 🔑 Reset fields
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
  },
  { timestamps: true }
);

// Optional: hash password before save
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
export default Admin;
