import ProductCard from "@/components/common/productCard";
import StickyPageHeader from "@/components/common/pageTitle";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";
import { ProductCardProps } from "@/interface";
import { XMarkIcon } from "@heroicons/react/24/outline";



const AllProducts = () => {
    const {
        data: products = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        staleTime: 1000 * 60,
        retry: 2,
    });

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-gray-600">
                <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
                    <XMarkIcon className='w-8 h-8 text-primary' />
                </span>
            </div>
        );
    }

    const sprayProducts = products.filter(
        (product: ProductCardProps) => product.category?.toLowerCase().includes("spray")
    );

    if (error) {
        return (
            <p className="w-full h-screen flex justify-center items-center text-red-600">
              Failed to load products. Please try again later.
            </p>
        );
    }

    return (
        <div className="w-full bg-gray-100 pt-14 flex flex-col gap-4 pb-6">
            <StickyPageHeader title="Body Spray Products" path="Home > Spray" />
            <div className="w-full flex flex-wrap justify-center items-center gap-4">
              {
                products.map((product: ProductCardProps) => (
                    <ProductCard key={product._id} product={product} />
                ))
              }
            </div>
        </div>
    )
}

export default AllProducts;