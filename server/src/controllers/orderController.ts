import { Request, Response } from "express";
import Order from "@/models/order";
import ShippingRule from "@/models/shippingModel";
import Product from "@/models/productModel";

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, shippingFee, subtotal, total, paymentMethod, notes } = req.body;

    const userId = req.user.id;

    const order = new Order({
      user: userId,
      items,
      shippingAddress,
      shippingFee,
      subtotal,
      total,
      paymentMethod,
      paymentStatus: "unpaid",
      orderStatus: "pending",
      notes,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Failed to create order", err });
  }
};

// Create order for guest checkout
export const guestCreateOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, shippingFee, subtotal, total, paymentMethod, guestInfo, notes } = req.body;


    const order = new Order({
      guestInfo,
      items,
      shippingAddress,
      shippingFee,
      subtotal,
      total,
      paymentMethod,
      paymentStatus: "unpaid",
      orderStatus: "pending",
      notes,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Failed to create order", err });
  }
};

// PATCH /api/orders/:id/payment-status
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found. Please try again later." });
    }

    const { paymentStatus } = req.body;

    if (!["unpaid", "awaiting_confirmation", "paid", "failed"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    order.paymentStatus = paymentStatus;
    order.hasMadePayment = paymentStatus === "awaiting_confirmation";
    if (paymentStatus === "paid") {
      order.payment.confirmedAt = new Date();
    }

    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};

 //GET all orders 
 export const getAllOrders = async (req: Request, res: Response) => { 
  try { 
    const orders = await Order.find().populate("user", "name email"); 
    res.status(200).json(orders); 
  } catch (err) { 
    console.error("Error fetching orders:", err); 
    res.status(500).json({ message: "Failed to fetch orders" }); 
  } 
};

// Get all orders for logged-in user and guest by email
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
  const guestEmail = req.query.email as string | undefined;

    if (!userId && !guestEmail) {
          return res.status(400).json({ message: "Missing user context. please refresh the page and try again." });
        }

    const query: any[] = [];

    if (userId) {
      query.push({ user: userId });
    }
    if (guestEmail) {
      query.push({ "guestInfo.email": guestEmail });
    }

    const orders = await Order.find({ $or: query })
      .populate("user", "userName email") // ✅ populate safe fields
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get single order by ID
export const getOrderById = async (req: Request, res: Response) => {
   const { id } = req.params; 
   try { 
    const order = await Order.findById(id) .populate("user", "userName email"); 
    if (!order) { 
      return res.status(404).json({ message: "Order not found" }); 
    } 
    res.status(200).json(order); 
  } catch (err) { 
    console.error("getOrderById error:", err); 
    res.status(500).json({ message: "Failed to fetch order" });
   } 
  };

// Update payment status
export const adminUpdatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "paid" | "failed" | "awaiting_confirmation"

    if (!["paid", "failed", "awaiting_confirmation"].includes(status)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findById(id); 
    if (!order) { 
      return res.status(404).json({ message: "Order not found" }); 
    }

      order.paymentStatus = status;
      await order.save();

    if (status === "paid" && order.items && order.items.length > 0) {
      for (const item of order.items) {
        if (!item.quantity || item.quantity <= 0) continue; // skip invalid quantities

        const product = await Product.findById(item.productId);
        if (product) {
          product.quantity = Math.max(product.quantity - item.quantity, 0);
          await product.save();
        }
      }
    }
    
    res.json({message: "Payment status updated successfully", order });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ message: "Failed to update payment status"});
  }
};

// Update order status (delivery)
export const adminUpdateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "delivered" | "not delivered"

    if (!["delivered", "not delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status, deliveredAt: status === "delivered" ? new Date() : null },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status", error: err });
  }
};

// ✅ Controller for Shipping checkbox
export const adminUpdateShippingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected: "shipped" or "processing"

    if (!["shipped", "processing"].includes(status)) {
      return res.status(400).json({ message: "Invalid shipping status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update shipping status", error: err });
  }
};

// ✅ Controller for Cancel checkbox
export const adminUpdateCancelStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected: "cancelled" or "processing"

    if (!["cancelled", "processing"].includes(status)) {
      return res.status(400).json({ message: "Invalid cancel status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cancel status", error: err });
  }
};



// Calculate shipping fee
export const calculateShipping = async (req: Request, res: Response) => { 
    try { 
        const { subtotal, state } = req.body; 
        const defaultPrice = 2000; 
        const rule = await ShippingRule.findOne({ state }); 
        let fee = defaultPrice; 
        if (rule) { 
            if (rule.freeShippingThreshold && subtotal >= rule.freeShippingThreshold) {
                 fee = 0;
                } else { 
                    fee = rule.price; 
                } 
            } 
            
            res.status(200).json({ fee }); 
        } catch (err) { 
            res.status(500).json({ message: "Failed to calculate shipping", error: err }); 
        } 
    };