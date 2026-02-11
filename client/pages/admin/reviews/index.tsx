import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import withAdminAuth from "@/utils/withAdminAuth";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: { userName: string; email: string };
  productId?: { name: string };
}

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Review[]>("/api/admin/reviews");
        setReviews(data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 pt-14 pb-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Customer Reviews</h1>

      {loading && <p className="text-gray-600">Loading reviews...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-gray-500">No reviews found.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {review.productId?.name ?? "Unknown Product"}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              By: {review.userId?.userName ?? "Guest"} ({review.userId?.email ?? "N/A"})
            </p>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < review.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default withAdminAuth(AdminReviewsPage);
