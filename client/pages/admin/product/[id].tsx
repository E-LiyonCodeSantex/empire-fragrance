
// pages/product/[id].tsx
import { useRouter } from 'next/router';
import Image from "next/image";
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import PopUpCard from '@/components/common/popUpCard';
import { ProductCardProps } from '@/interface/index';
import { useCart } from "@/context/useCart";
import api from '@/utils/axiosInstance';

const ProductDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const [product, setProduct] = useState<ProductCardProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found.");
                const data: ProductCardProps = await res.json();
                setProduct(data);
                setRating(data.rating ?? 0);

                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`)
                    .then(res => res.json())
                    .then(data => setReviews(data));
            } catch (error: any) {
                setError(error.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);


    const handleDelete = async () => {
        if (!product) return;
        try {
            api.delete(`/api/products/${product._id}`);
            alert("deleted successfully");
            router.push("/admin/product");
        } catch (err: any) {
            alert(err?.response?.data?.message ?? "Failed to delete product. Try again later.");
        }
    }

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-gray-600">
                <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
                    <XMarkIcon className='w-8 h-8 text-primary' />
                </span>
            </div>
        );
    }

    if (error || !product) {
        return (
            <p className="w-full h-screen flex justify-center items-center text-red-600">
                {error ? error : "Product not found"}
            </p>
        );
    }

    const isOutOfStock = product.quantity < 1;

    return (
        <div className="w-full flex justify-center bg-gray-300 items-center gap-4 px-4 flex-wrap pt-16 pb-8 relative">
            <Image
                src={product.imageUrl}
                alt={product.name}
                width={350}
                height={350}
                className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg"
            />
            <div className="flex flex-col justify-center items-start gap-2 text-gray-700">
                <h1 className="font-bold text-gray-800">{product.name}</h1>
                <b className="w-full p-4 bg-gray-400">₦{product.price}</b>
                <p>{product.description}</p>
                <p>Brand: {product.brand}</p>
                <p>Category: {product.category}</p>
                <div className="flex flex-wrap justify-center items-end gap-2">
                    {product.tags?.map(tag => (
                        <span
                            key={tag}
                            className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}

                </div>
                <p className={`flex gap-2 text-xs font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    <span>{product.quantity} pieces</span>
                </p>




                <div className="flex items-center gap-2">
                    <p className="font-bold">Overall Rating:</p>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                            key={star}
                            className={`w-5 h-5 ${(product.averageRating ?? 0) >= star ? "text-hoverSecondary" : "text-gray-400"
                                }`}
                        />
                    ))}
                    <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
                </div>

                <div className='flex flex-wrap justify-around items-center gap-2'>
                    <button
                        onClick={() => router.push(`/admin/product/create?id=${product._id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Edit Product
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded">
                        Delete Product
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ProductDetails;



/*
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchProductById, deleteProduct } from "@/services/productService";
import ProductForm from "@/components/common/ProductForm";

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(id as string),
    onSuccess: () => {
      alert("Product deleted");
      router.push("/admin/product");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load product</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => router.push(`/admin/product/create?id=${product._id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => deleteMutation.mutate()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;

*/