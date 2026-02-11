import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/context/useCart";
import api from "@/utils/axiosInstance"; // axios instance with baseURL = NEXT_PUBLIC_API_URL
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Order } from "@/interface/index";
import { useAuth } from "@/context/AuthContext";
/**
 * Schema: shipping + contact + payment method
 * Keep it minimal to reduce friction.
 */
const CheckoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(7, "Valid phone is required"),
  email: z.string().email("Valid email is required").optional(),
  street: z.string().min(5, "Street is required"),
  nearestBustop: z.string().min(2, "Nearest Bustop is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  paymentMethod: z.enum(["flutterwave", "bank_transfer"]),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof CheckoutSchema>;

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const { currentUser } = useAuth();

  const items = cart?.items ?? [];
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.quantity * (i.productId?.price ?? 0), 0),
    [items]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(CheckoutSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      street: "",
      nearestBustop: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      paymentMethod: "bank_transfer",
      notes: "",
    },
  });

    const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const res = await api.post<{ fee: number }>("/api/orders/calculate-shipping", {
          subtotal,
          state: watch("state"),
        });
        setShippingFee(res.data.fee);
      } catch (err) {
        console.error("failed to calculate shipping fee:", err);
      }
    };
    if (subtotal > 0 && watch("state"))
      fetchFee();
  }, [subtotal, watch("state")]);

  const total = subtotal + shippingFee;

  // Enforce stock limits on quantity changes (defensive)
  const safeUpdateQuantity = async (itemId: string, nextQty: number, stock: number) => {
    if (nextQty < 1 || nextQty > stock) return;
    try {
      await updateItem(itemId, nextQty);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to update quantity");
    }
  };

  const onPlaceOrder = async (payload: CheckoutForm) => {
    setError(null);
    setPlacing(true);

    try {
      // Build order payload
      const orderPayload: any = {
        items: items.map(i => ({
          productId: i.productId?._id ?? "",
          name: i.productId?.name ?? "",
          imageUrl: i.productId?.imageUrl ?? "",
          quantity: i.quantity,
          price: i.productId?.price ?? 0,
        })),
        shippingAddress: {
          recipientName: payload.fullName,
          phone: payload.phone,
          email: payload.email,
          street: payload.street,
          nearestBustop: payload.nearestBustop,
          city: payload.city,
          state: payload.state,
          postalCode: payload.postalCode,
          country: payload.country,
        },
        notes: payload.notes,
        subtotal,
        shippingFee,
        total,
        paymentMethod: payload.paymentMethod,
      };

      // If guest, add guestInfo
      if (!currentUser) {
        orderPayload.guestInfo = {
          name: payload.fullName,
          email: payload.email,
          phone: payload.phone,
        };
        let guestEmailFromCheckoutForm = orderPayload.guestInfo.email;
        localStorage.setItem("guestEmail", guestEmailFromCheckoutForm);
      }

      // 1) Choose correct route
      const route = currentUser
        ? "/api/orders/create"
        : "/api/orders/guest-create";

      const { data: order } = await api.post<Order>(route, orderPayload);


      // 3) Clear cart
      await clearCart();

      // 4) Redirect to success page
      router.push(`/user/product/orders/${order._id}?success=true`);

    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to place order, Please ";
      setError(message);
    } finally {
      setPlacing(false);
    }
  };



  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
          <XMarkIcon className="w-6 h-6 text-primary" />
        </span>
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-700">Your cart is empty.</p>
        <Link href="/" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>

      <main className="w-full min-h-screen bg-gray-50 pt-16 pb-10">
        <div className="mx-auto max-w-6xl px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: forms */}
          <section className="lg:col-span-2 space-y-6 text-gray-700">
            {/* Progress indicator 
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">Cart</span>
              <span>→</span>
              <span className="font-medium text-gray-900">Checkout</span>
              <span>→</span>
              <span>Order Success</span>
            </div>
            */}



            {/* Shipping form */}
            <form
              onSubmit={handleSubmit(onPlaceOrder)}
              className="space-y-6"
              noValidate
            >
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="font-semibold text-gray-800 mb-4">Shipping information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700">Full name</label>
                    <input className="mt-1 w-full rounded border px-3 py-2"
                      {...register("fullName")} />
                    {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Phone</label>
                    <input className="mt-1 w-full rounded border px-3 py-2"
                      {...register("phone")} />
                    {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Email (optional)</label>
                    <input className="mt-1 w-full rounded border px-3 py-2"
                      {...register("email")} />
                    {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Street Address</label>
                    <input className="mt-1 w-full rounded border px-3 py-2"
                      {...register("street")} />
                    {errors.street && <p className="text-xs text-red-600">{errors.street.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Nearest Bustop</label>
                    <input className="mt-1 w-full rounded border px-3 py-2"
                      {...register("nearestBustop")} />
                      {errors.nearestBustop && <p className="text-xs text-red-600">{errors.nearestBustop.message}</p> }
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">City</label>
                    <input className="mt-1 w-full rounded border px-3 py-2"
                      {...register("city")} />
                    {errors.city && <p className="text-xs text-red-600">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">State</label>
                    <input className="mt-1 w-full rounded border px-3 py-2"
                      {...register("state")} />
                    {errors.state && <p className="text-xs text-red-600">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Postal code (optional)</label>
                    <input className="mt-1 w-full rounded border px-3 py-2"
                      {...register("postalCode")} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Country</label>
                    <input className="mt-1 w-full rounded border px-3 py-2"
                      {...register("country")} />
                    {errors.country && <p className="text-xs text-red-600">{errors.country.message}</p>}
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="font-semibold text-gray-800 mb-4">Payment method</p>
                <div className="grid gap-3">
                  {/*<label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="flutterwave" {...register("paymentMethod")} />
                    <span className="text-sm text-gray-800">Flutterwave (cards, wallets, bank)</span>
                  </label>*/}
                  <label className="flex items-start justify-center flex-col gap-2 cursor-pointer">
                    <div className="flex justify-center items-center gap-2">
                      <input type="radio" value="bank_transfer" {...register("paymentMethod")} />
                      <span className="text-sm text-gray-800">Bank transfer</span>
                    </div>
                  </label>
                </div>


              </div>

              {/* Notes */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <label className="text-sm text-gray-700">Order notes (optional)</label>
                <textarea
                  className="mt-1 w-full rounded border px-3 py-2"
                  rows={3}
                  {...register("notes")}
                />
              </div>

              {/* Error + CTA */}
              {error && (
                <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!isValid || placing}
                className={`w-full rounded-md px-4 py-3 text-white font-semibold ${!isValid || placing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {placing ? "Processing…" : `Place order • ₦${total.toLocaleString()}`}
              </button>
            </form>
          </section>

          {/* Right: sticky order summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-16 z-10 rounded-lg border border-gray-200 bg-white p-4">
              <p className="font-semibold text-gray-800 mb-3">Order summary</p>
              <ul className="space-y-3">
                {items.map((i) => (
                  <li key={i._id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded overflow-hidden border bg-gray-100">
                      <Image
                        src={i.productId?.imageUrl ?? "/placeholder.png"}
                        alt={i.productId?.name ?? "Product"}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{i.productId?.name}</div>
                      <div className="text-xs text-gray-600">Qty: {i.quantity}</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ₦{(i.productId?.price * i.quantity).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">₦{shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-800 font-semibold">Total</span>
                  <span className="text-gray-900 font-bold">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                <span>Secure checkout</span>
                <span>Buyer protection</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
