import Image from 'next/image';
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ProductCardProps } from "@/interface/index";
import Link from 'next/link';

const AdminProductCard: React.FC<{ product: ProductCardProps }> = ({ product }) => {
    const [rating, setRating] = useState(product?.rating ?? 0);
    const [hoverRating, setHoverRating] = useState(0);

    const isOutOfStock = product.quantity < 1;
    console.log(product.tags);

    return (
        <Link href={`/admin/product/${product._id}`}>


            <div className='w-[120px] xs:w-[150px] h-[230px] xs:h-[250px] flex flex-col justify-start items-center bg-gray-200 gap-4 p-2 border-2 border-gray-400 rounded-lg group'>

                <div className='relative  w-[100px] xs:w-[120px] h-[80px] xs:h-[100px] group'>
                    <div className="absolute top-0 left-0 flex gap-1  z-10">
                        {product.tags?.map((tag) => (
                            <span key={tag} className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className='flex xs:hidden group-hover:flex flex-col gap-1 absolute right-1 top-1 z-10'>
                        <button>
                            <ShoppingCartIcon className="w-[20px] h-[20px] flex justify-center items-center text-gray-700 cursor-pointer hover:text-red-800" />
                        </button>
                        <button>
                            <HeartIcon className="w-[20px] h-[20px] flex justify-center items-center text-gray-700 cursor-pointer hover:text-red-800" />
                        </button>
                    </div>
                    <div className='relative w-[100px] xs:w-[120px] h-[80px] xs:h-[100px]'>
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                        />
                    </div>

                    <button
                        className="w-[100px] xs:w-[120px] bg-black/70 hover:bg-red-800 text-white py-1 absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >Add To Cart</button>

                    <p className={`text-xs font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    </p>
                </div>

                <div className='w-full flext flex-col justify-start items-center gap-1 overflow-hidden'>
                    {/* ⭐ Star Rating */}
                    <div className="flex justify-start items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                className={`w-[20px] h-[20px] cursor-pointer transition ${(hoverRating || rating) >= star ? 'text-secondary' : 'text-gray-400'
                                    }`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                    </div>

                    <h1 className='font-bold text-gray-800 text-sm w-max overflow-x-auto animate-scroll'>{product.name}</h1>
                    <p className='text-gray-600 w-max overflow-x-auto animate-scroll'>{product.description}</p>
                    <span className='font-bold text-sm text-gray-600'>{product.brand}</span>
                    <div className='flex justify-between items-center gap-1 flex-wrap'>
                        <span className='font-bold text-gray-800 text-sm'>₦{product.price}</span>
                        <span className='font-bold text-black/40 text-sm line-through'>₦{product.salePrice}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default AdminProductCard;