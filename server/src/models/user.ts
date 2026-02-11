import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface Address {
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
}

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  termsAccepted: boolean;
  role?: string;
  preferences?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    theme?: "light" | "dark";
  };
  addresses: Address[];
  // 🔑 Fields for password reset (code-based)
  resetCode?: string;
  resetCodeExpires?: Date;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<Address>(
  {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema: Schema<IUser> = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    termsAccepted: { type: Boolean, required: true },
    role: { type: String, default: "user" },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      theme: { type: String, default: "light" },
    },
    addresses: [AddressSchema],
    // 🔑 Reset fields
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
