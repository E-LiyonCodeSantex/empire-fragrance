import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import type { Order } from "@/interface/index";

const OrderDetailPage = () => {
    const router = useRouter();
    const { id, success } = router.query;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const { data } = await api.get<Order>(`/api/orders/${id}`);
                setOrder(data);
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Failed to fetch order details");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    return (
        <>
            <Head>
                <title>Order Details | Cartel Empire</title>
            </Head>

            <main className="max-w-4xl mx-auto px-1 py-10">
                {success && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6 text-center font-medium">
                        🎉 Order placed successfully!
                    </div>
                )}

                {loading && <div className="w-full min-h-screen flex items-center justify-center">
                    <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
                        <XMarkIcon className="w-6 h-6 text-primary" />
                    </span>
                </div>}
                {error && <p className="text-red-600">{error}</p>}

                {order && (
                    <div className="bg-white text-gray-700 shadow-lg rounded-lg py-8 px-6 space-y-8">
                        {/* Header */}
                        <div>
                            <h1 className="text-md font-bold">
                                Order Number:{" "}
                                <span className="ml-2 font-mono text-blue-600">{order.orderNumber}</span>
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Placed on: {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>

                        {/* Items */}
                        <section>
                            <h2 className="font-semibold text-lg mb-3">Items</h2>
                            <ul className="divide-y divide-gray-200">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="py-2 flex justify-between">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span className="font-medium">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <p className="py-2 flex justify-between">Shipping fee:
                                <span >₦{order.shippingFee.toLocaleString()}</span>
                            </p>
                            <p className="py-2 flex justify-between font-bold">Total bill: ₦{order.total.toLocaleString()}</p>
                        </section>

                        {/* Payment Instructions */}
                        <section className="bg-gray-50 p-5 rounded-md border border-gray-200">
                            <h2 className="font-semibold text-lg mb-2">Payment Instructions</h2>
                            <p>Transfer the sum of ₦{order.total.toLocaleString()} to the account below:</p>
                            <p>Bank: <span className="font-medium text-black">Cartel Empire Bank</span></p>
                            <p>Account Number: <span className="font-medium text-black">1234567890</span></p>
                            <p>Account Name: <span className="font-medium text-black">Cartel Empire Ltd</span></p>
                            <p className="mt-3 text-sm text-gray-600">
                                Please use <span className="font-mono text-blue-600">{order.orderNumber} </span>
                                as your transfer narration/reference. This is required for us to confirm your payment.
                            </p>
                        </section>

                        {/* Payment Status + Checkbox */}
                        <section className="flex flex-col gap-4">
                            <h2 className="font-semibold text-lg">Payment Status</h2>
                            <p
                                className={
                                    order.paymentStatus === "paid"
                                        ? "text-green-700 bg-green-100 px-4 py-2 rounded font-medium"
                                        : order.paymentStatus === "awaiting_confirmation"
                                            ? "text-yellow-700 bg-yellow-100 px-4 py-2 rounded font-medium"
                                            : "text-red-700 bg-red-100 px-4 py-2 rounded font-medium"
                                }
                            >
                                {order.paymentStatus.replace("_", " ").toUpperCase()}
                            </p>

                            {order.paymentStatus !== "paid" && (

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={order.paymentStatus === "awaiting_confirmation"}
                                        onChange={async (e) => {
                                            try {
                                                const newStatus = e.target.checked ? "awaiting_confirmation" : "unpaid";
                                                const { data } = await api.patch<Order>(
                                                    `/api/orders/${order._id}/payment-status`,
                                                    { paymentStatus: newStatus }
                                                );
                                                setOrder(data);
                                            } catch (err: any) {
                                                setError(err?.response?.data?.message ?? "Failed to update payment status");
                                            }
                                        }}
                                        className="h-5 w-5 accent-blue-600"
                                    />
                                    <span className="text-sm font-medium">✅ Check if you have made payment.</span>
                                </label>
                            )}
                            <span className="text-sm text-gray-600">Experiencing any issues? <a className="text-primary" href="mailto:bosssantexdlyon@gmail.com">Send a mail</a></span>

                        </section>

                        {/* Delivery Status */}
                        <section>
                            <h2 className="font-semibold text-lg">Delivery Status</h2>
                            {order.orderStatus === "delivered" && order.deliveredAt ? (
                                <p className="text-green-700 bg-green-100 px-4 py-2 rounded">
                                    Delivered on {new Date(order.deliveredAt).toLocaleString()}
                                </p>
                            ) : order.orderStatus === "shipped" ? (
                                <p className="text-blue-700 bg-blue-100 px-4 py-2 rounded">
                                    Shipped
                                </p>
                            ): order.orderStatus === "cancelled" ? (
                                <p className="text-red-700 bg-red-100 px-4 py-2 rounded">
                                    Cancelled
                                </p>
                            )
                            : (
                                <p className="text-yellow-700 bg-yellow-100 px-4 py-2 rounded">
                                    {order.orderStatus.replace("_", " ").toUpperCase()}
                                </p>
                            )}
                        </section>

                        {/* Actions */}
                        <section className="flex flex-wrap gap-2 justify-center">
                            <Link
                                href="/"
                                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/user/product/orders"
                                className="p-2 bg-gray-400 text-gray-800 rounded hover:bg-gray-500 transition"
                            >
                                View All Orders
                            </Link>
                        </section>
                    </div>
                )}
            </main>
        </>
    );
};

export default OrderDetailPage;
