"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("@/config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_1 = __importDefault(require("@/models/admin"));
//import { startEmailBankTransferPoller } from "../services/emailBankTransfer";
// Routes
const auth_1 = __importDefault(require("@/routes/auth"));
const adminRoutes_1 = __importDefault(require("@/routes/adminRoutes"));
const productRoutes_1 = __importDefault(require("@/routes/productRoutes"));
const reviewRoutes_1 = __importDefault(require("@/routes/reviewRoutes"));
const accountRoutes_1 = __importDefault(require("@/routes/accountRoutes"));
const cartRoutes_1 = __importDefault(require("@/routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("@/routes/orderRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: 'https://empire-fragrance-api.onrender.com',
    credentials: true
}));
app.use(express_1.default.json());
// Routes
// For admin routes
app.use('/api/admin', adminRoutes_1.default);
// For user routes
app.use('/api/user', auth_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/account", accountRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
//create admin if not created already
const seedAdmin = async () => {
    try {
        const existingAdmin = await admin_1.default.findOne({ email: process.env.ADMIN_EMAIL });
        if (!existingAdmin) {
            const hashedPassword = await bcryptjs_1.default.hash(process.env.ADMIN_PASSWORD, 12);
            const admin = new admin_1.default({
                userName: process.env.ADMIN_USERNAME || "admin",
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                termsAccepted: true,
            });
            await admin.save();
            console.log("✅ Admin user created");
        }
        else {
            console.log("ℹ️ Admin already exists");
        }
    }
    catch (err) {
        console.error("❌ Error seeding admin:", err);
    }
};
app.get('/', (req, res) => {
    res.send('Empire Fragrance is running');
});
// Connect to DB and start server
const PORT = process.env.PORT;
(0, db_1.default)()
    .then(async () => {
    await seedAdmin();
    /*a
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
