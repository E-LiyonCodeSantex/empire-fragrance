import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import api from "@/utils/axiosInstance";
import type { Cart } from "@/interface";

const CART_TOKEN_KEY = "cart_token";

interface CartContextProps {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  ensureCart: () => Promise<Cart>;
  cartCount: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem(CART_TOKEN_KEY) : null;

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const { data } = await api.get<Cart>("/api/cart", { params: { token } });
        setCart(data);
        setError(null);
      } catch (err: any) {
        setError(
          err.code === "ERR_NETWORK"
            ? "Backend unavailable: could not reach cart service. Please try again later."
            : "Failed to fetch cart data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const ensureCart = async (): Promise<Cart> => {
    if (cart) return cart;

    const token = getToken();
    if (!token) {
      try {
        const { data } = await api.post<Cart>("/api/cart/create-guest");
        if (data._id && data.token) {
          localStorage.setItem(CART_TOKEN_KEY, data.token);
          setCart(data);
          setError(null);
          return data;
        }
        setError("Failed to create guest cart");
        throw new Error("Failed to create guest cart");
      } catch (err: any) {
        setError(
          err.code === "ERR_NETWORK"
            ? "Backend unavailable: cannot create guest cart"
            : "Failed to create guest cart"
        );
        throw err;
      }
    }

    try {
      const { data } = await api.get<Cart>("/api/cart", { params: { token } });
      if (!data._id) {
        setError("Cart ID missing from server. Please try again.");
        throw new Error("Cart ID missing from server");
      }
      setCart(data);
      setError(null);
      return data;
    } catch (err: any) {
      setError(
        err.code === "ERR_NETWORK"
          ? "Backend unavailable: cannot fetch cart"
          : "Failed to fetch cart"
      );
      throw err;
    }
  };

  const addItem = async (productId: string, quantity: number = 1) => {
    const c = await ensureCart();
    try {
      const { data } = await api.post<Cart>(`/api/cart/${c._id}/items`, {
        productId,
        quantity,
      });
      setCart(data);
      setError(null);
    } catch (err: any) {
      setError(
        err.code === "ERR_NETWORK"
          ? "Backend unavailable: cannot add item"
          : "Failed to add item to cart"
      );
      throw err;
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    if (!cart) return;
    try {
      const { data } = await api.patch<Cart>(
        `/api/cart/${cart._id}/items/${itemId}`,
        { quantity }
      );
      setCart(data);
      setError(null);
    } catch (err: any) {
      setError(
        err.code === "ERR_NETWORK"
          ? "Backend unavailable: cannot update item"
          : "Failed to update cart item"
      );
    }
  };

  const removeItem = async (itemId: string) => {
    if (!cart) return;
    try {
      const { data } = await api.delete<Cart>(
        `/api/cart/${cart._id}/items/${itemId}`
      );
      setCart(data);
      setError(null);
    } catch (err: any) {
      setError(
        err.code === "ERR_NETWORK"
          ? "Backend unavailable: cannot remove item"
          : "Failed to remove cart item"
      );
    }
  };

  const clearCart = async () => {
    if (!cart) return;
    try {
      const { data } = await api.delete<Cart>(`/api/cart/${cart._id}`);
      setCart(data);
      setError(null);
    } catch (err: any) {
      setError(
        err.code === "ERR_NETWORK"
          ? "Backend unavailable: cannot clear cart"
          : "Failed to clear cart"
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        ensureCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
