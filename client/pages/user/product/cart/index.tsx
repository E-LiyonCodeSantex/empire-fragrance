import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { TrashIcon, PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/useCart";
import type { CartItem } from "@/interface/index";

const CartPage: React.FC = () => {
  const router = useRouter();
  const { cart, loading, updateItem, removeItem, clearCart, error } = useCart();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  // Because backend populates product details, each item looks like:
  // { _id, productId: { _id, name, price, image }, quantity }
  const items: CartItem[] = cart?.items ?? [];

  const subtotal = useMemo(() => {
    return items.reduce((s, i) => s + i.quantity * (i.productId?.price ?? 0), 0);
  }, [items]);

  const shippingFee = subtotal > 0 ? 500 : 0;
  const totalPrice = subtotal + shippingFee;
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  const handleRemove = async (itemId: string) => {
    setActionError(null);
    setBusyItemId(itemId);
    try {
      await removeItem(itemId);
    } catch (err: any) {
      setActionError(err?.response?.data?.message ?? err?.message ?? "Failed to remove item");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleUpdate = async (itemId: string, quantity: number, stock: number) => {
    setActionError(null);
    setBusyItemId(itemId);
    try {
      if (quantity > stock) {
        setActionError("Requested quantity exceeds available stock");
        return;
      }
      await updateItem(itemId, quantity);
    } catch (err: any) {
      setActionError(err?.response?.data?.message ?? err?.message ?? "Failed to update quantity");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleClear = async () => {
    setActionError(null);
    setClearing(true);
    try {
      await clearCart();
    } catch (err: any) {
      setActionError(err?.response?.data?.message ?? err?.message ?? "Failed to clear cart");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-gray-600">
        <span
          aria-busy="true"
          aria-label="Loading cart"
          className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin"
        >
          <XMarkIcon className="w-6 h-6 text-primary" />
        </span>
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
        <p className="text-gray-700">Your cart is empty.</p>
        <Link
          href="/"
          className="w-fit py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Browse products
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-gray-600">
        <p role="alert" className="text-red-600">Error loading cart: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-16 text-gray-500">
      {/* Header */}
      <div className="sticky top-0 z-10 flex flex-col w-full">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-gray-800 px-4 py-2">
          <div className="text-gray-200">
            <h1 className="text-xl font-semibold">Cart ({totalCount})</h1>
            <p className="text-2xl font-bold">₦{totalPrice.toLocaleString()}</p>
            <p className="text-sm">
              Subtotal ₦{subtotal.toLocaleString()} • Shipping ₦{shippingFee.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleClear}
            disabled={clearing}
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm ${clearing
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
              }`}
            aria-label="Clear all items from cart"
          >
            <TrashIcon className="h-4 w-4" />
            {clearing ? "Clearing…" : "Clear all"}
          </button>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}
      </div>

      {/* Items */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
          >
            <Link href={`/user/product/${item.productId?._id}`}>
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 bg-gray-100">
                  <Image
                    src={item.productId?.imageUrl ?? "/placeholder.png"}
                    alt={item.productId?.name ?? "Product"}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.productId?.name}</div>
                  <div className="text-sm text-gray-600">
                    Unit: ₦{item.productId?.price?.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium">
                    Line total: ₦{(item.productId?.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => handleRemove(item._id)}
                disabled={busyItemId === item._id}
                className={`flex items-center gap-1 rounded px-3 py-2 text-sm ${busyItemId === item._id
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                aria-label={`Remove ${item.productId?.name}`}
              >
                <TrashIcon className="w-4 h-4" />
                Remove
              </button>

              <div className="flex items-center rounded border border-gray-300">
                <button
                  onClick={() => handleUpdate(item._id, Math.max(1, item.quantity - 1), item.productId?.quantity ?? 0)}
                  disabled={busyItemId === item._id}
                  className="h-9 w-10 flex justify-center items-center border-r border-gray-300 bg-gray-100 hover:bg-gray-200"
                  aria-label={`Decrease quantity of ${item.productId?.name}`}
                >
                  <MinusIcon className="w-5 h-5 text-gray-700" />
                </button>

                <span
                  className="w-12 text-center font-semibold"
                  aria-live="polite"
                  aria-label={`Quantity of ${item.productId?.name}`}
                >
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleUpdate(item._id, item.quantity + 1, item.productId?.quantity ?? 0)}
                  disabled={busyItemId === item._id}
                  className="h-9 w-10 flex justify-center items-center border-l border-gray-300 bg-gray-100 hover:bg-gray-200"
                  aria-label={`Increase quantity of ${item.productId?.name}`}
                >
                  <PlusIcon className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer actions */}
      <div className="mt-8 flex flex-wrap gap-3 justify-between px-2 sm:px-4">
        <Link
          href="/"
          className="px-4 py-2 rounded-md text-white bg-gray-700 hover:bg-gray-800"
        >
          Continue shopping
        </Link>

        <button
          onClick={() => router.push("/user/product/checkout")}
          className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Checkout
        </button>
      </div>

    </div>
  );
};

export default CartPage;
