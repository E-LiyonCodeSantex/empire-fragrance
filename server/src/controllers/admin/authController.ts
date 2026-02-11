import bcrypt from "bcryptjs";
import Admin from "@/models/admin";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: "bosssantexdlyon@gmail.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("12345", 10);
      const admin = new Admin({
        userName: "empire fragrance",
        email: "bosssantexdlyon@gmail.com",
        password: hashedPassword,
      });
      await admin.save();
      console.log("Default admin created");
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
};
