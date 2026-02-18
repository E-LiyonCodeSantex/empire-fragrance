import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useMutation } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/services/productService";
import { ProductCardProps } from "@/interface";

interface ProductFormProps {
  initialData?: ProductCardProps; // if editing
  onSuccess: (product: ProductCardProps) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState<ProductCardProps>(
    initialData || {
      _id: "",
      name: "",
      description: "",
      price: 0,
      salePrice: 0,
      imageUrl: "",
      isAvailable: true,
      quantity: 0,
      brand: "",
      category: "",
      tags: [],
      sku: "",
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const router = useRouter();

  const mutation = useMutation<ProductCardProps, Error, FormData>({
    mutationFn: (data: FormData) => 
      initialData ? 
    updateProduct(initialData._id, data)
      : createProduct(data),
    onSuccess: (savedProduct) => {
      setIsLoading(false);
      setMessage({ type: "success", text: `Product ${initialData ? "updated" : "created"} successfully!` });
      onSuccess(savedProduct);
    },
    onError: (err: any) => {
      setIsLoading(false);
      console.error(err);
      setMessage({ type: "error", text: "Something went wrong." + (err.response?.data?.message || "Try again later.") });
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description || "");
    payload.append("price", String(formData.price));
    payload.append("salePrice", String(formData.salePrice));
    payload.append("quantity", String(formData.quantity));
    payload.append("isAvailable", String(formData.isAvailable));
    payload.append("brand", formData.brand || "");
    payload.append("category", formData.category || "");
    payload.append("sku", formData.sku || "");
    if (formData.tags) {
      payload.append("tags", formData.tags.join(","));
    }
    if (selectedFile) {
      payload.append("image", selectedFile); // ✅ Multer will pick this up as req.file
    } else {
      payload.append("image", formData.imageUrl); // fallback if editing without new file
    }

    if (initialData) {
      mutation.mutate(payload);
    } else {
      mutation.mutate(payload);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md bg-gray-100 p-6 rounded-lg shadow">
      <label htmlFor="name" className="flex flex-col gap-1">
        <span className="font-medium">Product Name</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="border border-gray-400 p-2 rounded-md"
        />
      </label>

      <label htmlFor="description" className="flex flex-col gap-1">
        <span className="font-medium">Description</span>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="border border-gray-400 p-2 rounded-md"
        />
      </label>
      <label htmlFor="price" className="flex flex-col gap-1">
        <span className="font-medium">Price</span>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="border border-gray-400 p-2 rounded-md"
        />
      </label>

      <label htmlFor="salePrice" className="flex flex-col gap-1">
        <span>Sale Price (optional)</span>
        <input
          type="number"
          name="salePrice"
          value={formData.salePrice}
          onChange={handleChange}
          placeholder="Sale Price (optional)"
          className="border border-gray-400 p-2 rounded-md"
        />
      </label>
      <label htmlFor="image" className="flex flex-col gap-1">
        <span>Select Image</span>
        <input
          type="file"
          onChange={handleFileChange}
          placeholder="Select Image"
          required={!initialData} // require image if creating new product
          className="border border-gray-400 p-2 rounded-md"
        />
      </label>
      {selectedFile && (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="w-32 h-32 object-cover rounded"
        />
      )}
      <label htmlFor="brand" className="flex flex-col gap-1">
        <span className="font-medium">Brand</span>
        <input
          type="text"
          name="brand"
          value={formData.brand || ""}
          onChange={handleChange}
          placeholder="Brand"
          className="border border-gray-400 p-2 rounded-md"
        />
      </label>
      <label htmlFor="category" className="flex flex-col gap-1">
        <span className="font-medium">Category</span>
        <input
          type="text"
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          placeholder="Category"
          className="border border-gray-400 p-2 rounded-md"
        />
      </label>
      <label htmlFor="quantity" className="flex flex-col gap-1">
        <span className="font-medium">Quantity</span>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="border border-gray-400 p-2 rounded-md"
        />
      </label>
      <label htmlFor="tags" className="flex flex-col gap-1">
        <span className="font-medium">Tags (type comma to give space)</span>
        <input
          type="text"
          name="tags"
          value={(formData.tags ?? []).join(", ")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            }))
          }
          placeholder="Tags (comma separated)"
          className="w-full border p-2 rounded text-gray-600"
        />
      </label>

      <label htmlFor="sku" className="flex flex-col gap-1">
        <span className="font-medium">SKU</span>
        <input
          type="text"
          name="sku"
          value={formData.sku || ""}
          onChange={handleChange}
          placeholder="SKU (product code)"
          className="w-full border p-2 rounded text-gray-600"
        />
      </label>

      <div className="w-full flex justify-center items-center px-4">
        {message && (
          <div style={{ color: message.type === "error" ? "red" : "green" }}>
            {message.text}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-white py-2 rounded hover:bg-hoverPrimary"
      >
        {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
