"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("@/models/productModel"));
const cloudinary_1 = require("cloudinary");
const uploadToCloudinary_1 = require("@/utils/uploadToCloudinary");
// Create product with required image upload
const createProduct = async (req, res) => {
    try {
        let imageUrl = req.body.imageUrl;
        if (req.file) {
            // Upload to Cloudinary or S3
            try {
                const result = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, req.file.mimetype);
                imageUrl = result.secure_url;
            }
            catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({ message: "Cloudinary upload failed" });
            }
        }
        // ✅ Normalize tags
        let tags = [];
        if (typeof req.body.tags === "string") {
            tags = req.body.tags.split(",").map((t) => t.trim()).filter(Boolean);
        }
        else if (Array.isArray(req.body.tags)) {
            tags = req.body.tags;
        }
        const product = new productModel_1.default({ ...req.body, imageUrl, tags, });
        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    }
    catch (err) {
        console.log("req.body:", req.body);
        console.error("❌ Error creating product:", err);
        res.status(500).json({ message: "❌ Failed to create product" });
    }
};
exports.createProduct = createProduct;
// Get all products
const getProducts = async (_req, res) => {
    try {
        const products = await productModel_1.default.find();
        res.json(products);
    }
    catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
exports.getProducts = getProducts;
// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await productModel_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    }
    catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({ message: "Failed to fetch product" });
    }
};
exports.getProductById = getProductById;
// Update product with optional image replacement
const updateProduct = async (req, res) => {
    try {
        // Upload new image if provided
        let imageUrl = req.body.imageUrl;
        if (req.file) {
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const result = await cloudinary_1.v2.uploader.upload(base64, {
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
        const product = await productModel_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product updated successfully", product });
    }
    catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await productModel_1.default.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Failed to delete product" });
    }
};
exports.deleteProduct = deleteProduct;
