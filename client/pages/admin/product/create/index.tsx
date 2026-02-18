import withAdminAuth from "@/utils/withAdminAuth";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/services/productService";
import ProductForm from "@/components/common/ProductForm";
import Products from "@/pages/user/product";

const ProductCreateOrEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-full text-gray-700 pt-14 min-h-screen pb-4 px-3 flex flex-col gap-4 justify-center items-center">
      <h1 className="text-xl font-bold">
        {id ? "Edit Product" : "Create Product"}
      </h1>
      <ProductForm
        initialData={id ? product : undefined}
        onSuccess={(savedProduct) => router.push(`/admin/product/${savedProduct._id}`)}
      />
    </div>
  );
};

export default withAdminAuth(ProductCreateOrEdit);

