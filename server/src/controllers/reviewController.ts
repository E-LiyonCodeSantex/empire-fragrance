import { Request, Response } from "express";
import Review from "@/models/review";
import Product from "@/models/productModel";

//Add a review
export const addReview = async (req: Request, res: Response) => {
    try {
        const { productId, userId, rating, comment } = req.body;

        if (!productId || !userId || !rating) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        //user can only rate once
        const existing = await Review.findOne({ productId, userId });
        if (existing) {
            return res.status(400).json({ message: "You already reviewed this product" });
        }

        const review = new Review({ productId, userId, rating, comment });
        await review.save();

        //update product aggregate
        const stats = await Review.aggregate([
            { $match: { productId: review.productId } },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating" },
                    reviewCount: { $sum: 1 },
                },
            },
        ]);
        await Product.findByIdAndUpdate(productId, {
            averageRating: stats[0].averageRating,
            reviewCount: stats[0].reviewCount,
        });
        res.status(201).json({ message: "Review added successfully", review });
    } catch (err) {
        console.log(req.body);
        console.error("Error adding review:", err);
        res.status(500).json({ message: "Failed to add review" });
    }
};

//Get reviews for a product
export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ productId: id }).populate("userId", "userName email");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// ✅ Get all reviews
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({})
      .populate("userId", "userName email") // show user info
      .populate("productId", "name")        // show product info
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

