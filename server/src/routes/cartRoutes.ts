import express from "express";
import { createGuestCart, getCart, addItem, updateItem, removeItem, clearCart } from "@/controllers/cartController";

const router = express.Router();

// POST: create guest cart
router.post("/create-guest", createGuestCart);

// GET: fetch cart by token
router.get("/", getCart);

// POST: add item to cart
router.post("/:id/items", addItem);

// PATCH: update item quantity
router.patch("/:id/items/:itemId", updateItem);

// DELETE: remove item from cart
router.delete("/:id/items/:itemId", removeItem);

// DELETE: clear cart
router.delete("/:id", clearCart);

export default router;