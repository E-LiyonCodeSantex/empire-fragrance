import StickyPageHeader from "@/components/common/pageTitle";
import ProductCard from "@/components/common/productCard";
import { ProductCardProps } from "@/interface/index";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";

const Products = () => {


    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        staleTime: 1000 * 60,
        retry: 2,
    });

    if (isLoading) return <p>Loading products...</p>;
    if (error) return <p>Failed to load products</p>;
    return (
        <div className="w-full bg-gray-100 pt-14 min-h-screen pb-4 px-2 flex flex-col justify-start items-center gap-4">

            <div className="w-full flex flex-row flex-wrap justify-center items-center gap-4">

                {products.map((product: ProductCardProps) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>

    )
}


export default Products;