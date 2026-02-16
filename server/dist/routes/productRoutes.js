"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const validateRegister_1 = require("@/middleware/validateRegister");
const productController_1 = require("@/controllers/productController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }); // buffer upload
// POST: create product
router.post("/", upload.single("image"), validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, productController_1.createProduct);
// PUT: update product
router.put("/:id", upload.single("image"), validateRegister_1.authMiddleware, validateRegister_1.requireAdmin, productController_1.updateProduct);
// GET: all products
router.get("/", productController_1.getProducts);
// GET: single product by ID
router.get("/:id", productController_1.getProductById);
// DELETE: remove product
router.delete("/:id", productController_1.deleteProduct);
exports.default = router;
