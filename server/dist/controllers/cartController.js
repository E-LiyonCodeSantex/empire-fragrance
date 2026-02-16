"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeItem = exports.updateItem = exports.addItem = exports.getCart = exports.createGuestCart = void 0;
const cartModel_1 = __importDefault(require("@/models/cartModel"));
const productModel_1 = __importDefault(require("@/models/productModel"));
const crypto_1 = __importDefault(require("crypto"));
const createGuestCart = async (req, res) => {
    try {
        const cart = await cartModel_1.default.create({
            token: crypto_1.default.randomUUID(),
            items: [],
        });
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create guest cart" });
    }
};
exports.createGuestCart = createGuestCart;
// ✅ Get cart by token
const getCart = async (req, res) => {
    try {
        const { token } = req.query;
        const cart = await cartModel_1.default.findOne({ token }).populate("items.productId");
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch cart" });
    }
};
exports.getCart = getCart;
// ✅ Add item to cart
const addItem = async (req, res) => {
    try {
        const { id } = req.params; // cart id
        const { productId, quantity } = req.body;
        const product = await productModel_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        const cart = await cartModel_1.default.findById(id);
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        const existing = cart.items.find((it) => it.productId.toString() === productId);
        if (existing) {
            existing.quantity += quantity;
        }
        else {
            cart.items.push({ productId, quantity });
        }
        await cart.save();
        await cart.populate("items.productId");
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to add item" });
    }
};
exports.addItem = addItem;
// ✅ Update item quantity
const updateItem = async (req, res) => {
    try {
        const { id, itemId } = req.params; // cart id, item id
        const { quantity } = req.body;
        const cart = await cartModel_1.default.findById(id);
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        const item = cart.items.find((it) => it._id.toString() === itemId);
        if (!item)
            return res.status(404).json({ message: "Item not found" });
        item.quantity = quantity;
        await cart.save();
        await cart.populate("items.productId");
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update item" });
    }
};
exports.updateItem = updateItem;
// ✅ Remove item from cart
const removeItem = async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const cart = await cartModel_1.default.findById(id);
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        const itemIndex = cart.items.findIndex((it) => it._id.toString() === itemId);
        if (itemIndex === -1)
            return res.status(404).json({ message: "Item not found" });
        cart.items.splice(itemIndex, 1);
        await cart.save();
        await cart.populate("items.productId");
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to remove item" });
    }
};
exports.removeItem = removeItem;
// ✅ Clear cart
const clearCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await cartModel_1.default.findById(id);
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        cart.items = [];
        await cart.save();
        await cart.populate("items.productId");
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to clear cart" });
    }
};
exports.clearCart = clearCart;
