// pages/admin/orders/[id].tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import api from "@/utils/axiosInstance";
import type { Order } from "@/interface/index";
import withAdminAuth from "@/utils/withAdminAuth";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";

const AdminOrderDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchOrder = async () => {
            try {
                setLoading(true);
                const { data } = await api.get<Order>(`/api/admin/orders/${id}`);
                setOrder(data);
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Failed to fetch order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleShippingChange = async (checked: boolean) => {
        if (!order) return;
        try {
            const newStatus = checked ? "shipped" : "processing";
            const { data } = await api.put<Order>(`/api/admin/orders/${order._id}/order-shipping-status`, { status: newStatus });
            setOrder(data);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Failed to update order status");
        }
    };

    // Handle Delivered checkbox
    const handleDeliveredChange = async (checked: boolean) => {
        if (!order) return;
        try {
            const newStatus = checked ? "delivered" : "not delivered";
            const { data } = await api.put<Order>(`/api/admin/orders/${order._id}/order-delivery-status`, { status: newStatus });
            setOrder(data);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Failed to update order status");
        }
    };

    const handleCancelChange = async (checked: boolean) => {
        if (!order) return;
        try {
            const newStatus = checked ? "cancelled" : "processing";
            const { data } = await api.put<Order>(`/api/admin/orders/${order._id}/order-cancel-status`, { status: newStatus });
            setOrder(data);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Failed to update order status");
        }
    };

    if (loading) {
        <div className="w-full min-h-screen flex items-center justify-center">
            <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
                <XMarkIcon className="w-6 h-6 text-primary" />
            </span>
        </div>
    }

    return (
        <>
            <Head>
                <title>Admin | Order Details</title>
            </Head>

            <main className="max-w-4xl mx-auto px-2 pt-16 pb-6">
                <h1 className="text-2xl text-gray-700 font-bold mb-6">Order Details</h1>

                {/* Order Info */}
                {order && (
                    <div className="bg-gray-100 shadow-md rounded-lg py-4 border border-gray-400 space-y-2 text-gray-700">
                        <div className="grid grid-cols-2 gap-4 px-2">
                            <p className="flex flex-col gap-1 justify-center items-center"><strong>Order #:</strong> {order.orderNumber}</p>
                            <p className="flex flex-col gap-1 justify-center items-center"><strong>Customer:</strong> {order.user ? order.user.userName : order.guestInfo?.name ?? "Guest"}</p>
                            <p className="flex flex-col gap-1 justify-center items-center"><strong>Email:</strong> {order.user ? order.user.email : order.guestInfo?.email ?? "N/A"}</p>
                            <p className="flex flex-col gap-1 justify-center items-center"><strong>Total:</strong> ₦{order.total.toLocaleString()}</p>
                            <p className="flex flex-col gap-1 justify-center items-center"><strong>Payment Status:</strong> {order.paymentStatus}</p>
                            <p className="flex flex-col gap-1 justify-center items-center"><strong>Order Status:</strong> {order.orderStatus}</p>
                            <p className="flex flex-col gap-1 justify-center items-center"><strong>Placed On:</strong> <span className="bg-primary/50 rounded px-1 py-2 w-fit h-fit"> {new Date(order.createdAt).toLocaleString()}</span></p>
                            <p className="flex flex-col gap-1 justify-center items-center">
                                <strong className="">Delivery Status</strong>
                                {order.orderStatus === "delivered" && order.deliveredAt ? (
                                    <p className="text-green-700 bg-green-200 px-4 py-2 rounded">
                                        Delivered on {new Date(order.deliveredAt).toLocaleString()}
                                    </p>
                                ) : order.orderStatus === "shipped" ? (
                                    <p className="text-blue-700 bg-blue-100 px-4 py-2 rounded">
                                        Shipped
                                    </p>
                                ) : order.orderStatus === "cancelled" ? (
                                    <p className="text-red-700 bg-red-200 px-4 py-2 rounded">
                                        Cancelled
                                    </p>
                                )
                                    : (
                                        <p className="text-yellow-700 bg-yellow-100 px-4 py-2 rounded">
                                            {order.orderStatus.replace("_", " ").toUpperCase()}
                                        </p>
                                    )}
                            </p>
                        </div>

                        {/**Address detail container */}
                        <div className="mt-4 w-full flex flex-col justify-start items-center border-t-2 border-gray-500 pt-4 px-2">
                            <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
                            <div className="flex flex-wrap items-start justify-center gap-2 border-b-2 border-gray-400 pb-2">
                                <p className="text-gray-600">{order.shippingAddress?.street},</p>
                                <p className="text-gray-600">{order.shippingAddress?.nearestBustop},</p>
                                <p className="text-gray-600">{order.shippingAddress?.city}, (PO-BOX: {order.shippingAddress?.postalCode}), {order.shippingAddress?.state}</p>
                                <p className="text-gray-600">{order.shippingAddress?.country}</p>
                            </div>
                            <div className="flex justify-start items-center gap-2 pt-2">
                                <h2 className="text-md font-semibold">Note:</h2>
                                <p className="text-gray-600">{order.notes}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="w-full px-2 border-b-2 border-t-2 border-gray-400">
                            <h2 className="text-lg font-semibold mt-6 mb-2">Items</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300 bg-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="p-2 border border-gray-300">Product</th>
                                            <th className="p-2 border border-gray-300">Image</th>
                                            <th className="px-4 py-2 border border-gray-300">Quantity</th>
                                            <th className="px-4 py-2 border border-gray-300">Price</th>
                                            <th className="px-4 py-2 border border-gray-300">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item) => (
                                            <tr key={item.productId} className="bg-gray-50 even:bg-gray-100">
                                                <td className=" p-2 border border-gray-300 ">
                                                    {item.name} 
                                                    </td>
                                                <td className="px-4 py-2 border border-gray-300 w-fit">
                                                    <Image 
                                                    src={item.imageUrl} 
                                                    alt={item.name} 
                                                    width={50} 
                                                    height={50} 
                                                    className="rounded-md" />
                                                    </td>
                                                <td className="px-4 py-2 border border-gray-300">{item.quantity}</td>
                                                <td className="px-4 py-2 border border-gray-300">₦{item.price.toLocaleString()}</td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    ₦{(item.price * item.quantity).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="py-2 flex font-semibold justify-between">Shipping fee:
                                    <span >₦{order.shippingFee.toLocaleString()}</span>
                                </p>
                                <p className="py-2 font-semibold flex justify-between">Total:
                                    <span className="">₦{(order.total).toLocaleString()}</span>
                                </p>
                            </div>
                        </div>

                        {/* Payment & Delivery Controls */}
                        <div className="mt-6 flex flex-col gap-4">
                            <h2 className="text-lg font-semibold">Admin Controls</h2>

                            <div className="flex justify-around items-center gap-4 border-b-2 border-gray-400 pb-2 px-2">
                                {/* Paid Checkbox */}
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={order.paymentStatus === "paid"}
                                        disabled={order.paymentStatus === "unpaid" || order.paymentStatus === "failed"}
                                        onChange={async (e) => {
                                            const newStatus = e.target.checked ? "paid" : "awaiting_confirmation";
                                            const { data } = await api.put<Order>(`/api/admin/orders/${order._id}/payment-status`, { status: newStatus });
                                            setOrder(data);
                                        }}
                                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-gray-700">Paid</span>
                                </label>

                                {/* Failed Checkbox */}
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={order.paymentStatus === "failed"}
                                        disabled={order.paymentStatus === "unpaid" || order.paymentStatus === "paid"}
                                        onChange={async (e) => {
                                            const newStatus = e.target.checked ? "failed" : "awaiting_confirmation";
                                            const { data } = await api.put<Order>(`/api/admin/orders/${order._id}/payment-status`, { status: newStatus });
                                            setOrder(data);
                                        }}
                                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="text-gray-700">Failed</span>
                                </label>
                            </div>

                            <div className="flex justify-around items-center gap-4">
                                {/* Shipping Checkbox */}
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={order.orderStatus === "shipped"}
                                        disabled={order.paymentStatus !== "paid" || order.orderStatus === "delivered" || order.orderStatus === "cancelled"}
                                        onChange={(e) => handleShippingChange(e.target.checked)}
                                        className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                                    />
                                    <span className="text-gray-700">Shipping</span>
                                </label>

                                {/* Delivered Checkbox */}
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={order.orderStatus === "delivered"}
                                        disabled={order.paymentStatus !== "paid" || order.orderStatus === "shipped" || order.orderStatus === "cancelled"}
                                        onChange={(e) => handleDeliveredChange(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">Delivered</span>
                                </label>

                                {/* Cancel Checkbox */}
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={order.orderStatus === "cancelled"}
                                        disabled={order.paymentStatus !== "paid" || order.orderStatus === "shipped" || order.orderStatus === "delivered"}
                                        onChange={(e) => handleCancelChange(e.target.checked)}
                                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="text-gray-700">Cancelled</span>
                                </label>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default withAdminAuth(AdminOrderDetailPage);
