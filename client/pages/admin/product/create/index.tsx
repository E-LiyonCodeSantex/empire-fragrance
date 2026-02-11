import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/services/productService";
import ProductForm from "@/components/common/ProductForm";

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
        onSuccess={() => router.push("/admin/product")}
      />
    </div>
  );
};

export default ProductCreateOrEdit;


/*import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axiosInstance";
import { ProductCardProps } from "@/interface";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ProductFormPage() {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const router = useRouter();
    const { id } = router.query; // if present, we're editing
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<ProductCardProps>({
        _id: "",
        name: "",
        description: "",
        price: "" as unknown as number,
        salePrice: "" as unknown as number,
        imageUrl: "",
        rating: 0,
        isAvailable: true,
        tags: [] as string[],
        brand: "",
        category: "",
        quantity: "" as unknown as number,
        sku: "",
    });


    // Load product if editing
    useEffect(() => {
        if (id) {
            api.get<ProductCardProps>(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
                .then(res => setFormData(res.data))
                .catch(err => console.error("Error loading product:", err));
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "salePrice" || name === "quantity" || name === "rating"
                ? value === "" ? "" : Number(value)
                : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description ?? "");
        data.append("price", String(formData.price));
        data.append("rating", String(formData.rating));
        data.append("isAvailable", String(formData.isAvailable));
        if (formData.salePrice) data.append("salePrice", String(formData.salePrice));
        data.append("brand", formData.brand ?? "");
        data.append("category", formData.category ?? "");
        data.append("quantity", String(formData.quantity));
        if (formData.tags && formData.tags.length > 0) {
            data.append("tags", formData.tags.join(","));
        }
        data.append("sku", formData.sku ?? "");
        // If the admin pasted an existing URL, support it:
        if (formData.imageUrl) data.append("imageUrl", formData.imageUrl);
        if (selectedFile) data.append("image", selectedFile);

        try {
            if (id) {
                // Update existing product
                await api.put(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setMessage({ type: "success", text: "✅ Product updated successfully" });
            } else {
                // Create new product
                await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setMessage({ type: "success", text: "✅ Product created successfully" });
            }
            setTimeout(() => router.push("/admin/product"), 1500);
        } catch (error: any) {
            console.error("Product save error:", error);
            setMessage(error.response?.data?.message || { type: "error", text: "❌ Failed to save product" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
            setMessage({ type: "error", text: "🗑️ Product deleted successfully" });
            setTimeout(() => router.push("/admin/products"), 1500);
        } catch (error: any) {
            console.error("Delete error:", error);
            setMessage(error.response?.data?.message || { type: "error", text: "❌ Failed to delete product" });
        }
    };

    return (
        <div className="w-full bg-gray-100 pt-14 min-h-screen pb-4 px-3 justify-start items-center">
            <div className="max-w-2xl mx-auto w-full bg-white shadow-md rounded-xl border-2 border-gray-400">
                <div className="bg-primary px-3 py-4 mb-3 rounded-t-xl">
                    <h1 className="text-2xl font-bold mb-4">
                        {id ? "Edit Product" : "Create Product"}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="w-full border p-2 rounded text-gray-600"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full border p-2 rounded text-gray-600"
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Present Price"
                        className="w-full border p-2 rounded text-gray-600"
                        required
                    />
                    <input
                        type="number"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleChange}
                        placeholder="Initial Price"
                        className="w-full border p-2 rounded text-gray-600"
                        required
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        placeholder="Image URL"
                        className="w-full border p-2 rounded text-gray-600"
                        required
                    />
                    {selectedFile && (
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded"
                        />
                    )}

                    <input
                        type="text"
                        name="brand"
                        value={formData.brand || ""}
                        onChange={handleChange}
                        placeholder="Brand"
                        className="w-full border p-2 rounded text-gray-600"
                    />
                    <input
                        type="text"
                        name="category"
                        value={formData.category || ""}
                        onChange={handleChange}
                        placeholder="Category"
                        className="w-full border p-2 rounded text-gray-600"
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity || ""}
                        onChange={handleChange}
                        placeholder="Quantity"
                        className="w-full border p-2 rounded text-gray-600"
                    />
                    <input
                        type="text"
                        name="tags"
                        value={(formData.tags ?? []).join(", ")}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                tags: e.target.value.split(",").map(tag => tag.trim())
                            }))
                        }
                        placeholder="Tags (comma separated)"
                        className="w-full border p-2 rounded text-gray-600"
                    />

                    <input
                        type="text"
                        name="sku"
                        value={formData.sku || ""}
                        onChange={handleChange}
                        placeholder="SKU"
                        className="w-full border p-2 rounded text-gray-600"
                    />

                    <div className="w-full flex justify-center items-center px-4">
                        {message && (
                            <div style={{ color: message.type === 'error' ? 'red' : 'green' }}>
                                {message.text}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="py-2 w-[200px] px-4 bg-primary hover:bg-hoverPrimary rounded-xl flex justify-center items-center font-bold text-white flex items-center gap-2"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-t-2 border-gray-100 rounded-full animate-spin">
                                <XMarkIcon className='w-4 h-4 text-gray-100' />
                            </span>
                        ) : (
                            'Submit'
                        )}
                    </button>

                    {id && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                        >
                            Delete Product
                        </button>
                    )}
                </form>

            </div>
        </div>
    );
}
*/
