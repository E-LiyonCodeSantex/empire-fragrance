"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("@/controllers/cartController");
const router = express_1.default.Router();
// POST: create guest cart
router.post("/create-guest", cartController_1.createGuestCart);
// GET: fetch cart by token
router.get("/", cartController_1.getCart);
// POST: add item to cart
router.post("/:id/items", cartController_1.addItem);
// PATCH: update item quantity
router.patch("/:id/items/:itemId", cartController_1.updateItem);
// DELETE: remove item from cart
router.delete("/:id/items/:itemId", cartController_1.removeItem);
// DELETE: clear cart
router.delete("/:id", cartController_1.clearCart);
exports.default = router;
