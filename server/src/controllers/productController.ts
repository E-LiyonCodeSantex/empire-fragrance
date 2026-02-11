import { Request, Response } from "express";
import Product from "@/models/productModel";
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";



// Create product with required image upload
export const createProduct = async (req: Request, res: Response) => {
  try {
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      // Upload to Cloudinary or S3
      try {
        const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
        imageUrl = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }
    }

     // ✅ Normalize tags
    let tags: string[] = [];
    if (typeof req.body.tags === "string") {
      tags = req.body.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    } else if (Array.isArray(req.body.tags)) {
      tags = req.body.tags;
    }

    const product = new Product({ ...req.body, imageUrl, tags, });
    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.log("req.body:", req.body);
    console.error("❌ Error creating product:", err);
    res.status(500).json({ message: "❌ Failed to create product" });
  }
};

// Get all products
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};


// Update product with optional image replacement
export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Upload new image if provided
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "products",
        overwrite: true,
        invalidate: true,
      });
      imageUrl = result.secure_url;
    }

    // Prepare update payload
    const updateData = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
      salePrice: req.body.salePrice ? Number(req.body.salePrice) : undefined,
      rating: req.body.rating ? Number(req.body.rating) : undefined,
      quantity: req.body.quantity ? Number(req.body.quantity) : undefined,
      imageUrl,
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};


// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
