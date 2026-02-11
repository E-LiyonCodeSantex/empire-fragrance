
import AdminProductCard from "@/components/common/adminProductCard";
import { ProductCardProps } from "@/interface/index";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Products = () => {


    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        staleTime: 1000 * 60,
        retry: 2,
    });

    if (isLoading) return (
           <div className="w-full h-screen flex justify-center items-center text-gray-600">
                        <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
                            <XMarkIcon className='w-8 h-8 text-primary' />
                        </span>
                    </div>
    )
    if (error) return <p>Failed to load products</p>;
    return (
        <div className="w-full bg-gray-100 pt-14 min-h-screen pb-4 px-2 flex flex-col justify-start items-center gap-4">

            <div className="w-full flex flex-row flex-wrap justify-center items-center gap-4">

                {products.map((product: ProductCardProps) => (
                    <AdminProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>

    )
}


export default Products;