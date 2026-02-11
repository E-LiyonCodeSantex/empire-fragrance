import express from "express";
import { addReview, getReviewsByProduct } from "@/controllers/reviewController";

const router = express.Router();

router.post("/", addReview); // POST /api/reviews
router.get("/:id", getReviewsByProduct); // GET /api/reviews/:productId

export default router;
