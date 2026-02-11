import { Geist, Geist_Mono } from "next/font/google";
import ProductCard from "@/components/common/productCard";
import { PRODUCTS } from "@/constant/productCard";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";
import { ProductCardProps } from "@/interface";
import dynamic from "next/dynamic";
import { XMarkIcon } from "@heroicons/react/24/outline";

const LandingSlider = dynamic(
  () => import("@/components/common/landing"),
  { ssr: false }
);



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60,
    retry: 2,
  });

  if (isLoading) return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
        <XMarkIcon className="w-6 h-6 text-primary" />
      </span>
    </div>
  );

  if (error) return <p>Failed to load products</p>;
  return (
    <div className="w-full min-h-[400px] bg-gray-100 pb-4 px-2 overflow-hidden">
      <LandingSlider />

      <div className="flex flex-col justify-start items-center w-full gap-4">

        <div className="flex flex-nowrap flex-col justify-center items-start w-screen gap-4 px-2 pt-2 overflow-hidden">
          <div className="w-full p-2 text-gray-800 flex justify-between font-bold items-center gap-4 border-b-2 border-gray-500">
            <h1>popular Products</h1>
            <button className="text-secondary hover:text-hoverSecondary"><a href="/user/product/popular">View All</a></button>
          </div>

          <div className="w-full pl-2 flex flex-nowrap overflow-x-auto justify-start items-center gap-4 no-scrollbar">
            {products
              .filter((product: ProductCardProps) => product.tags?.includes("popular"))
              .map((product: ProductCardProps) => (
                <ProductCard key={product._id} product={product} />
              ))}

          </div>
        </div>

        <div className="flex flex-nowrap flex-col justify-center items-start w-screen gap-4 px-2 pt-2 overflow-hidden">
          <div className="w-full p-2 text-gray-800 flex justify-between font-bold items-center gap-4 border-b-2 border-gray-500">
            <h1>New Arrival</h1>
            <button className="text-secondary hover:text-hoverSecondary"><a href="/user/product/new">View All</a></button>
          </div>

          <div className="w-full px-2 flex flex-nowrap overflow-x-auto justify-start items-center gap-4 no-scrollbar">
            {
              PRODUCTS
              .filter((product: ProductCardProps) => product.tags?.some(tag => tag.toLowerCase().includes("new"))
              ).map((product: ProductCardProps) => (
                <ProductCard key={product._id} product={product} />
              ))
            }
          </div>
        </div>

        <div className="flex flex-nowrap flex-col justify-center items-start w-screen gap-4 px-2 pt-2 overflow-hidden">
          <div className="w-full p-2 text-gray-800 flex justify-between font-bold items-center gap-4 border-b-2 border-gray-500">
            <h1>Body spray</h1>
            <button className="text-secondary hover:text-hoverSecondary"><a href="/user/product/spray">View All</a></button>
          </div>

          <div className="w-full px-2 flex flex-nowrap overflow-x-auto justify-start items-center gap-4 no-scrollbar">
            {products
              .filter((product: ProductCardProps) => product.category?.toLowerCase().includes("spray"))
              .map((product: ProductCardProps) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}

