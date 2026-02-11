// pages/product/[id].tsx
import { useRouter } from 'next/router';
import Image from "next/image";
import { PlusIcon, MinusIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import PopUpCard from '@/components/common/popUpCard';
import { ProductCardProps } from '@/interface/index';
import { useCart } from "@/context/useCart"; 


const ProductDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const { cart, addItem, updateItem } = useCart();
    const [product, setProduct] = useState<ProductCardProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [popupMessage, setPopupMessage] = useState<{type: "error" | "success"; text: string} | null>(null);

    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() =>{
        if (id && cart) {
            const existingItem = cart.items.find(item => item.productId._id === id);
            if (existingItem) {
                setSelectedQuantity(existingItem.quantity);
            }
        }
    }, [id, cart]);

    const increase = () => {
        setSelectedQuantity(prev =>
            product && prev < product.quantity ? prev + 1 : prev
        );
    };

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

  const handleAddToCart = async () => {
  try {
    if (!product?._id) {
      console.error("Product ID is missing");
      return;
    }

    setCartLoading(true);

    if(product.quantity < 1) {
        setPopupMessage({type: "error", text: "Sorry, this product is out of stock."});
        setShowPopup(true);
        return;
    }

    const existingItemInCart = cart?.items.find(item => item.productId._id === product._id);

    if (existingItemInCart) {
        await updateItem(existingItemInCart._id, selectedQuantity);
        setPopupMessage({type: "success", text: "Quantity updated in cart"});
    } else {
        await addItem(product._id, selectedQuantity);
        setPopupMessage({type: "success", text: "Item added to cart"});
    }

    // Show success popup
    setShowPopup(true);
  } catch (err: any) {
    console.error("Failed to add item:", err);
  } finally {
    setCartLoading(false);
  }
};




    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-gray-600">
                <span className="w-10 h-10 border-2 border-t-2 border-gray-200 flex justify-center items-center rounded-full animate-spin">
                    <XMarkIcon className='w-8 h-8 text-gray-200' />
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
            {showPopup && (
                <PopUpCard
                    quantity={selectedQuantity}
                    total={selectedQuantity * product.price}
                    message={popupMessage}
                    onClose={() => setShowPopup(false)} />
            )}
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

                <a
                    href={`/user/product/reviews/${product._id}`}
                    className="text-white text-sm bg-gray-600 px-2 py-1 rounded-xl hover:bg-gray-700">
                    Review this product</a>

                <div className="flex flex-wrap justify-center items-center gap-4">
                    <div className="w-fit border-2 border-gray-600 gap-4 flex flex-wrap justify-center items-center">
                        <button onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                            className="w-[50px] h-[50px] px-2 flex justify-center items-center border-r-2 border-gray-700 bg-gray-500 hover:bg-red-500">
                            <MinusIcon className="w-6 h-6 font-bold text-white" />
                        </button>
                        <span
                            className="w-[50px] flex justify-center items-center font-bold text-gray-800">
                            {selectedQuantity}</span>
                        <button
                            onClick={increase}
                            className="w-[50px] h-[50px] px-2 flex justify-center items-center border-l-2 border-gray-700 bg-gray-500 hover:bg-green-800">
                            <PlusIcon className="w-6 h-6 font-bold text-white" />
                        </button>
                    </div>

                    <button
                        className="py-2 px-4 bg-gray-600 hover:bg-gray-700 font-bold text-white flex items-center gap-2"
                        onClick={handleAddToCart}
                    >
                        {cartLoading ? (
                            <span className="w-5 h-5 border-2 border-t-2 border-gray-100 rounded-full animate-spin">
                                <XMarkIcon className='w-4 h-4 text-gray-100' />
                            </span>
                        ) : (
                            'Add to Cart'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
