import { Request, Response } from "express";
import User from "@/models/user";
import Product from "@/models/productModel";
import Order from "@/models/order";
import Contact from "@/models/contact";
import Review from "@/models/review";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const totalRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const processingOrders = await Order.countDocuments({ orderStatus: "processing" });
    const shippedOrders = await Order.countDocuments({ orderStatus: "shipped" });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "delivered" });
    const resolvedMessages = await Contact.countDocuments({ status: "resolved" });
    const pendingMessages = await Contact.countDocuments({ status: "pending" });
    const totalReviews = await Review.countDocuments();

    res.json({
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      revenue: totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      resolvedMessages,
      pendingMessages,
      reviews: totalReviews,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// ✅ Get all users (name + email)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "userName email createdAt").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};


export const getOrdersTrend = async (req: Request, res: Response) => {
  try {
    // Group orders by month
    const trend = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Map months to labels
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = labels.map((_, i) => {
      const found = trend.find((t) => t._id === i + 1);
      return found ? found.count : 0;
    });

    res.json({ labels, data });
  } catch (err) {
    console.error("Error fetching orders trend:", err);
    res.status(500).json({ message: "Failed to fetch orders trend" });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalSold: 1,
        },
      },
    ]);

    console.log("DEBUG: Top products aggregation result:", topProducts);

    res.json(topProducts);
  } catch (err) {
    console.error("Error fetching top products:", err);
    res.status(500).json({ message: "Failed to fetch top products" });
  }
};

