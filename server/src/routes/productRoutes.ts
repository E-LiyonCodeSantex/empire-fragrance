import express from "express";
import multer from "multer";
import { authMiddleware, requireAdmin } from "@/middleware/validateRegister"
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "@/controllers/productController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // buffer upload

// POST: create product
router.post("/", upload.single("image"), authMiddleware, requireAdmin, createProduct);

// PUT: update product
router.put("/:id", upload.single("image"), authMiddleware, requireAdmin, updateProduct);


// GET: all products
router.get("/", getProducts);

// GET: single product by ID
router.get("/:id", getProductById);

// DELETE: remove product
router.delete("/:id", deleteProduct);

export default router;
