import { Request, Response } from "express";
import Product from "@/models/productModel";

// POST /api/admin/products
export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      rating,
      isAvailable,
      salePrice,
      tags,
      brand,
      category,
      quantity,
    } = req.body;

    // Basic validation
    if (!name || !price || !imageUrl || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      rating,
      isAvailable,
      salePrice,
      tags,
      brand,
      category,
      quantity,
    });

    await product.save();

    return res.status(201).json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    console.error("Add product error:", error);
    return res.status(500).json({ success: false, message: "Server error. Could not create product." });
  }
};

// GET /api/admin/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ success: false, message: "Server error. Could not fetch products." });
  }
};

// GET /api/admin/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get product by ID error:", error);
    return res.status(500).json({ success: false, message: "Server error. Could not fetch product." });
  }
};
