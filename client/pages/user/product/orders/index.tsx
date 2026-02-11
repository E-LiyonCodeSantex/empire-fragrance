import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import type { Order } from "@/interface/index";
import { useAuth } from "@/context/AuthContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/dist/client/components/navigation";

const OrdersPage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let url = "/api/orders";

        if (!currentUser) {
          const guestEmail = localStorage.getItem("guestEmail");
          
          if (guestEmail) {
            url += `?email=${encodeURIComponent(guestEmail)}`
          }
        }
        const { data } = await api.get<Order[]>(url);
        setOrders(data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  return (
    <>
      <main className="max-w-4xl mx-auto px-2 pt-14 pb-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">My Orders</h1>

        {loading && <div className="w-full min-h-screen flex items-center justify-center">
          <span className="w-10 h-10 border-2 border-t-2 border-gray-300 flex justify-center items-center rounded-full animate-spin">
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </span>
        </div>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="w-full flex flex-col justify-center items-center gap-2">
            <p className="text-gray-700">You have no orders yet.</p>
            <button onClick={() => router.back()}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Go back
            </button>
          </div>
        )}

        <div className="flex flex-wrap w-full gap-4 justify-center text-gray-700">
          {orders.map((order) => (
            <div key={order._id} className="flex flex-col max-w-2xl bg-gray-300 p-2 gap-2 border-2 rounded-xl border-gray-400 justify-between items-center">
              <div className="flex flex-col justify-between items-start gap-2">
                <p className="font-medium text-black">Order ID: <span className="break-all text-md">{order._id}</span></p>
               <div className="flex flex-wrap gap-1">
                 <p className="text-sm text-gray-700">
                  Order Sts: {order.orderStatus} | 
                </p>
                <p className="text-sm text-gray-700">
                  Payment Sts: {order.paymentStatus}
                </p>
               </div>
              </div>
              <div className="flex  justify-between items-center gap-2">
                <p className="text-sm text-gray-500">
                  {order.orderStatus === "delivered" && order.deliveredAt && (
                    <> | Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</>
                  )}
                </p>
                <Link
                  href={`/user/product/orders/${order._id}`}
                  className="px-2 text-sm min-w-[95px] py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default OrdersPage;




/** 
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import type { Order } from "@/interface/index"; // ensure you have an Order interface
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useModal } from "@/context/ModalContext";

const OrderSuccessPage = () => {
  const router = useRouter();
  const { id } = router.query; // dynamic route param
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const { setActiveModal } = useModal();

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Order>(`/api/orders/${id}`);
        setOrder(data);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Failed to fetch order details";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <>
      <Head>
        <title>Order Success | Cartel Empire</title>
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {loading && (
           <div className="w-full min-h-screen flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-t-2 border-gray-300 flex justify-center items-center rounded-full animate-spin">
          <XMarkIcon className="w-6 h-6 text-gray-500" />
        </span>
      </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 flex flex-col gap-2 justify-center items-center">
            <p>{error}</p>
            <button onClick={() => router.back()}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Go back
            </button>
            <span className="text-bold">Or</span>
            <button
             onClick={() => setActiveModal('login')}
             className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
             >
            login in
            </button>
          </div>
        )}

        {order && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              🎉 Order Placed Successfully!
            </h1>
            <p className="text-gray-700 mb-6">
              Thank you for your purchase. Your order ID is{" "}
              <span className="font-mono font-semibold">{order._id}</span>.
            </p>

           
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Items</h2>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

      
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
              <p className="text-gray-700">
                {order.shippingAddress.recipientName} <br />
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>} <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode} <br />
                {order.shippingAddress.country}
              </p>
              <p className="text-gray-700 mt-2">
                Phone: {order.shippingAddress.phone}
              </p>
              {order.shippingAddress.email && (
                <p className="text-gray-700">Email: {order.shippingAddress.email}</p>
              )}
            </section>

     \
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>₦{order.shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </section>

 
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Payment Status</h2>
              <p
                className={`font-medium ${
                  order.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order.paymentStatus.toUpperCase()}
              </p>
            </section>

            <div className="flex gap-4 mt-6">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue Shopping
              </Link>
              <Link
                href="/user/orders"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                View My Orders
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default OrderSuccessPage;
*/