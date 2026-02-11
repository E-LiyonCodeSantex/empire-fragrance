import { Request, Response } from "express";
import Product from "@/models/productModel";
import User from "@/models/user";
import Order from "@/models/order";

export const adminSearch = async (req: Request, res: Response) => {
  const { q, type } = req.query; // q = keyword, type = products|users|orders

  if (!q || typeof q !== "string") {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    let results: any = {};

    if (!type || type === "products") {
      results.products = await Product.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { brand: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } }
        ],
      }).limit(10);
    }

    if (!type || type === "users") {
      results.users = await User.find({
        $or: [
          { userName: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } }
        ],
      }).limit(10);
    }

    if (!type || type === "orders") {
      results.orders = await Order.find({
        $or: [
          { orderNumber: { $regex: q, $options: "i" } },   // ✅ FIXED FIELD NAME
          { "guestInfo.email": { $regex: q, $options: "i" } }
        ],
      }).limit(10);
    }

    res.json({
      products: results.products || [],
      users: results.users || [],
      orders: results.orders || []
    });
  } catch (err) {
    console.error("Admin search error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const userSearch = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    const results = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ],
    }).limit(10);

    res.json({ products: results });
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
