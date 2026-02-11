import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";

const ReviewProduct = () => {
    const router = useRouter();
    const { id } = router.query; // productId from URL
    const { currentUser } = useAuth();
    const { setActiveModal } = useModal();

    const [reviews, setReviews] = useState<any[]>([]);
    const [newRating, setNewRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

    // Fetch reviews for this product
    useEffect(() => {
        if (!id) return;
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`);
                if (!res.ok) throw new Error("Failed to load reviews");
                const data = await res.json();

                // ✅ Ensure data is an array
                setReviews(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchReviews();
    }, [id]);

    // Submit a new review
    const handleSubmitReview = async () => {
        if (!id) return;

        if (newRating === 0) {
            setMessage({ type: "error", text: "Please use the stars to rate" });
            return;
        }
        if (!currentUser) {
            alert("You must be logged in to leave a review");
            setActiveModal("login");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: id,
                    userId: currentUser._id,
                    rating: newRating,
                    comment,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // ✅ Show backend error (e.g. duplicate review)
                setMessage({ type: "error", text: data.message || "Failed to submit review" });
                return;
            }

            setMessage({ type: "success", text: "Review submitted successfully!" });
            setComment("");
            setNewRating(0);

            // Refresh reviews after submission
            const refresh = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`);
            const refreshedData = await refresh.json();
            setReviews(Array.isArray(refreshedData) ? refreshedData : []);

            // wait briefly then go back
            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <p className="h-screen text-red-600">{error}</p>;
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2">
            <h2 className="mt-6 font-bold text-lg text-hoverPrimary">REVIEW</h2>
            <div className="max-w-2xl mx-auto p-2">
                {/* Submit Review */}
                <p className=" mt-2 text-gray-700">Leave a Review</p>
                <div className="flex gap-2 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setNewRating(star)}>
                            <StarIcon
                                className={`w-6 h-6 ${newRating >= star ? "text-hoverSecondary" : "text-gray-600"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."
                    className="border-2 border-gray-500 p-2 w-full mt-2 rounded text-gray-700 focus:outline-none"
                />
                <div className="w-full flex justify-start items-center py-2 px-4">
                    {message && (
                        <div style={{ color: message.type === "error" ? "red" : "green" }}>
                            {message.text}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmitReview}
                    disabled={loading}
                    className="py-2 w-[200px] px-4 bg-primary hover:bg-hoverPrimary rounded-xl flex justify-center items-center font-bold text-white flex items-center gap-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-t-2 border-gray-100 rounded-full animate-spin">
                            <XMarkIcon className="w-4 h-4 text-gray-100" />
                        </span>
                    ) : (
                        "Submit Review"
                    )}
                </button>
            </div>

            <div className="w-full h-[2px] bg-black/60"></div>

            <div className="max-w-2xl mx-auto p-2">
                <h2 className="mt-6 font-bold text-lg text-hoverPrimary">Customer Reviews</h2>

                {/* Reviews List */}
                <div>
                    {reviews.length === 0 ? (
                        <p className="text-gray-700">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((r) => (
                            <div key={r._id} className="border-2 border-gray-500 p-2 my-2 rounded text-gray-700">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon
                                            key={star}
                                            className={`w-5 h-5 ${r.rating >= star ? "text-hoverSecondary" : "text-gray-400"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p>{r.comment}</p>
                                <small>By {r.userId?.userName || "Anonymous"}</small>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewProduct;
