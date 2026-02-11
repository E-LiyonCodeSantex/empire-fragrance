import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from "@/config/db";
import bcrypt from "bcryptjs";
import Admin from "@/models/admin";
//import { startEmailBankTransferPoller } from "../services/emailBankTransfer";

// Routes
import authRoutes from "@/routes/auth";
import adminRoutes from "@/routes/adminRoutes";
import productRoutes from "@/routes/productRoutes";
import reviewRoute from "@/routes/reviewRoutes";
import accountRoutes from "@/routes/accountRoutes";
import cartRoutes from "@/routes/cartRoutes";
import orderRoutes from "@/routes/orderRoutes";


const app = express();


// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
// For admin routes
app.use('/api/admin', adminRoutes);

// For user routes
app.use('/api/user', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/orders", orderRoutes);



//create admin if not created already
const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12);

      const admin = new Admin({
        userName: process.env.ADMIN_USERNAME || "admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        termsAccepted: true,
      });

      await admin.save();
      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  }
};


app.get('/', (req, res) => {
  res.send('Empire Fragrance is running');
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await seedAdmin();

    /*
    // Start the email bank transfer poller once DB is connected
    startEmailBankTransferPoller().catch((err) => {
      console.error("❌ Failed to start email poller:", err);
    });
    */

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });


