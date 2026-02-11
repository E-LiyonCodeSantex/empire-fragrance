// controllers/cartController.ts
import { Request, Response } from "express";
import Cart from "@/models/cartModel";
import Product from "@/models/productModel";
import crypto from "crypto";

export const createGuestCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.create({
      token: crypto.randomUUID(),
      items: [],
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to create guest cart" });
  }
};

// ✅ Get cart by token
export const getCart = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        const cart = await Cart.findOne({ token }).populate("items.productId");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch cart" });
    }
};

// ✅ Add item to cart
export const addItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // cart id
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const cart = await Cart.findById(id);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const existing = cart.items.find((it) => it.productId.toString() === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        await cart.populate("items.productId");
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to add item" });
    }
};

// ✅ Update item quantity
export const updateItem = async (req: Request, res: Response) => {
    try {
        const { id, itemId } = req.params; // cart id, item id
        const { quantity } = req.body;

        const cart = await Cart.findById(id);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find((it) => it._id!.toString() === itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.quantity = quantity;
        await cart.save();
        await cart.populate("items.productId");
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to update item" });
    }
};

// ✅ Remove item from cart
export const removeItem = async (req: Request, res: Response) => {
    try {
        const { id, itemId } = req.params;

        const cart = await Cart.findById(id);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex((it) => it._id!.toString() === itemId);
        if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

        cart.items.splice(itemIndex, 1);
        await cart.save();
        await cart.populate("items.productId");
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to remove item" });
    }
};

// ✅ Clear cart
export const clearCart = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const cart = await Cart.findById(id);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        await cart.save();
        await cart.populate("items.productId");
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to clear cart" });
    }
};
