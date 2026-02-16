"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getProducts = exports.addProduct = void 0;
const productModel_1 = __importDefault(require("@/models/productModel"));
// POST /api/admin/products
const addProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, rating, isAvailable, salePrice, tags, brand, category, quantity, } = req.body;
        // Basic validation
        if (!name || !price || !imageUrl || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }
        const product = new productModel_1.default({
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
    }
    catch (error) {
        console.error("Add product error:", error);
        return res.status(500).json({ success: false, message: "Server error. Could not create product." });
    }
};
exports.addProduct = addProduct;
// GET /api/admin/products
const getProducts = async (req, res) => {
    try {
        const products = await productModel_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, products });
    }
    catch (error) {
        console.error("Get products error:", error);
        return res.status(500).json({ success: false, message: "Server error. Could not fetch products." });
    }
};
exports.getProducts = getProducts;
// GET /api/admin/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await productModel_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        return res.status(200).json({ success: true, product });
    }
    catch (error) {
        console.error("Get product by ID error:", error);
        return res.status(500).json({ success: false, message: "Server error. Could not fetch product." });
    }
};
exports.getProductById = getProductById;
