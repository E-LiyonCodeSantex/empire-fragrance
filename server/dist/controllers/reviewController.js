"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReviews = exports.getReviewsByProduct = exports.addReview = void 0;
const review_1 = __importDefault(require("@/models/review"));
const productModel_1 = __importDefault(require("@/models/productModel"));
//Add a review
const addReview = async (req, res) => {
    try {
        const { productId, userId, rating, comment } = req.body;
        if (!productId || !userId || !rating) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        //user can only rate once
        const existing = await review_1.default.findOne({ productId, userId });
        if (existing) {
            return res.status(400).json({ message: "You already reviewed this product" });
        }
        const review = new review_1.default({ productId, userId, rating, comment });
        await review.save();
        //update product aggregate
        const stats = await review_1.default.aggregate([
            { $match: { productId: review.productId } },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating" },
                    reviewCount: { $sum: 1 },
                },
            },
        ]);
        await productModel_1.default.findByIdAndUpdate(productId, {
            averageRating: stats[0].averageRating,
            reviewCount: stats[0].reviewCount,
        });
        res.status(201).json({ message: "Review added successfully", review });
    }
    catch (err) {
        console.log(req.body);
        console.error("Error adding review:", err);
        res.status(500).json({ message: "Failed to add review" });
    }
};
exports.addReview = addReview;
//Get reviews for a product
const getReviewsByProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await review_1.default.find({ productId: id }).populate("userId", "userName email");
        res.json(reviews);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};
exports.getReviewsByProduct = getReviewsByProduct;
// ✅ Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await review_1.default.find({})
            .populate("userId", "userName email") // show user info
            .populate("productId", "name") // show product info
            .sort({ createdAt: -1 });
        res.json(reviews);
    }
    catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};
exports.getAllReviews = getAllReviews;
