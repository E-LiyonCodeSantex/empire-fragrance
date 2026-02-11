import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import type { Order } from "@/interface/index";
import withAdminAuth from "@/utils/withAdminAuth";
import { useRouter } from "next/router";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Order[]>("/api/admin/orders/all");
        setOrders(data);

        if (router.query.filter) {
          setFilter(router.query.filter as string);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router.query.filter]);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.paymentStatus === filter ||o.orderStatus === filter);

  return (
    <>
      <Head>
        <title>Admin | Orders Dashboard</title>
      </Head>

      <main className="max-w-6xl mx-auto px-4 pt-16 pb-6">
        <h1 className="text-2xl text-gray-700 font-bold mb-6">Orders Dashboard</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["all", "unpaid", "awaiting_confirmation", "paid", "failed", "pending", "delivered", "processing", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded font-medium transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {status.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-gray-700">Loading orders...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Orders Table */}
        {!loading && !error && (
          <div className="overflow-x-auto bg-white text-gray-600 shadow-md rounded-lg">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border border-gray-300">Order #</th>
                  <th className="p-2 border border-gray-300">Customer</th>
                  <th className="p-2 border border-gray-300">Total</th>
                  <th className="p-2 border border-gray-300">Payment Status</th>
                  <th className="p-2 border border-gray-300">Order Status</th>
                  <th className="p-2 border border-gray-300">Placed On</th>
                  <th className="p-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500 border border-gray-300">
                      No orders found for this filter.
                    </td>
                  </tr>
                )}
                {filteredOrders.map((order) => (
                  
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="p-2 border border-gray-300 font-mono text-blue-600">
                      {order.orderNumber}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {order.user ? order.user.userName : order.guestInfo?.name ?? "Guest"}
                    </td>
                    <td className="p-2 border border-gray-300 font-medium">
                      ₦{order.total.toLocaleString()}
                    </td>
                    <td className="p-2 border border-gray-300">
                      <span
                        className={`px-3 py-1 rounded text-sm font-bold ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : order.paymentStatus === "awaiting_confirmation"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.paymentStatus === "unpaid"
                            ? "bg-red-100 text-red-700"
                            : order.paymentStatus === "failed"
                            ? "bg-red-100 text-red-700"
                             : order.paymentStatus === "pending"
                             ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.paymentStatus.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2 border border-gray-300">
                      <span
                        className={`px-3 py-1 rounded text-sm font-bold ${
                          order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.orderStatus === "processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : order.orderStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            :"bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.orderStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2 border border-gray-300 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 border border-gray-300">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default withAdminAuth(AdminOrdersPage);
