// client/services/productService.ts
import api from "@/utils/axiosInstance";
import { ProductCardProps } from "@/interface";


interface ProductResponse { 
  success: boolean; 
  message: string; 
  product: ProductCardProps; 
}


export async function fetchProducts(): Promise<ProductCardProps[]> {
  const res = await api.get<ProductCardProps[]>("/api/products");
  return res.data;
}

export async function fetchProductById(id: string): Promise<ProductCardProps> {
  const res = await api.get<ProductCardProps>(`/api/products/${id}`);
  return res.data as ProductCardProps;
}

export const createProduct = async (data: FormData): Promise<ProductCardProps> => {
  const res = await api.post<ProductResponse>("/api/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.product;
};  

export const updateProduct = async (id: string, data: FormData): Promise<ProductCardProps> => {
  const res = await api.put<ProductResponse>(`/api/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.product;
};

export const deleteProduct = async (id: string) =>{
  const { data } = await api.delete(`/api/products/${id}`);
  alert("Product deleted");
  return data;
}