import { useRouter } from 'next/router';
import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/outline';

const ReviewProduct = () => {

    const router = useRouter();
    const { id } = router.query;

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);
    const [newRating, setNewRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmitRewiew = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                productId: id,
                userId: "mockUserId123",
                rating: newRating,
                comment,
            }),
        });
        setComment("");
        setNewRating(0);

    };

    return (
        <div>
            {/* Existing product details */}

            <h2 className="mt-6 font-bold text-lg">Customer Reviews</h2>
            <div>
                {reviews.map((r) => (
                    <div key={r._id} className="border p-2 my-2">
                        <p>⭐ {r.rating}</p>
                        <p>{r.comment}</p>
                        <small>By {r.userId?.name || "Anonymous"}</small>
                    </div>
                ))}
            </div>

            <h3 className="mt-4">Leave a Review</h3>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setNewRating(star)}>
                        <StarIcon className={`w-6 h-6 ${newRating >= star ? "text-yellow-500" : "text-gray-400"}`} />
                    </button>
                ))}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                className="border p-2 w-full mt-2"
            />
            <button onClick={handleSubmitRewiew} className="bg-blue-600 text-white px-4 py-2 mt-2">
                Submit Review
            </button>
        </div>
    )
}

export default ReviewProduct;