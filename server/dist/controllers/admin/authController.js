"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_1 = __importDefault(require("@/models/admin"));
const seedAdmin = async () => {
    try {
        const existingAdmin = await admin_1.default.findOne({ email: "bosssantexdlyon@gmail.com" });
        if (!existingAdmin) {
            const hashedPassword = await bcryptjs_1.default.hash("12345", 10);
            const admin = new admin_1.default({
                userName: "empire fragrance",
                email: "bosssantexdlyon@gmail.com",
                password: hashedPassword,
            });
            await admin.save();
            console.log("Default admin created");
        }
    }
    catch (err) {
        console.error("Error seeding admin:", err);
    }
};
exports.seedAdmin = seedAdmin;
