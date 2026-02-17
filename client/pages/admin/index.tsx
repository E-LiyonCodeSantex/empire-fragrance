// pages/admin/dashboard.tsx
import withAdminAuth from "@/utils/withAdminAuth";
import { XMarkIcon, UserIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import api from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useRouter } from "next/router";


ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface OrdersTrend {
  labels: string[];
  data: number[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [ordersTrend, setOrdersTrend] = useState<OrdersTrend | null>(null);
  const { currentUser, loading, logout } = useAuth();
  const { setActiveModal } = useModal();

  const router = useRouter();

  const handleLogout = () => {
    alert("Are you sure you want to logout?");
    logout();
    router.push("/");
  }

  useEffect(() => {
    api.get("api/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch dashboard stats:", err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendRes = await api.get<OrdersTrend>("/api/admin/dashboard/orders-trend");
        setOrdersTrend(trendRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard analytics:", err);
      }
    };
    fetchData();
  }, []);

  if (!stats) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
          <XMarkIcon className="w-6 h-6 text-primary" />
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
          <XMarkIcon className="w-6 h-6 text-primary" />
        </span>
      </div>
    );
  }

  return (
    <div className="px-6 pt-14 pb-6 min-h-screen ">
      <h1 className="text-3xl font-bold mb-6 flex flex-col justify-center items-center text-gray-600">Admin Dashboard</h1>

      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-4">
        Welcome, {currentUser?.userName}
      </h1>

      <button
        onClick={handleLogout}
        className="flex justify-center items-center w-full mt-4 mb-6 px-4 py-2 rounded-lg bg-gray-800 hover:bg-black text-white"
      >
        <ArrowRightEndOnRectangleIcon className="w-5 h-5" /> Logout
      </button>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 text-gray-600 gap-6 mb-8">

        <section
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <div className="flex items-center gap-2">
            <UserIcon className="w-fit h-fit" />
            <h2 className="font-bold">Profile</h2>
          </div>
          <div className="flex flex-col justify-center items-start gap-2">

            <p>Email: {currentUser?.email}</p>
            <p>Username: {currentUser?.userName}</p>
          </div>
          <button onClick={() => setActiveModal('updateProfile')}
            className="font-bold text-gray-100 bg-primary hover:bg-hoverPrimary py-2 px-4 cursor-pointer rounded">
            Update Profile
          </button>
          {/* Add form to update profile */}
        </section>

        <Link
          href="/admin/users"
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Users</h2>
          <p className="text-2xl text-primary">{stats.users}</p>
        </Link>

        <Link
          href="/admin/product"
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Products</h2>
          <p className="text-2xl text-primary">{stats.products}</p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Orders</h2>
          <p className="text-2xl text-primary">{stats.orders}</p>
        </Link>
        <div className="bg-white shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Revenue</h2>
          <p className="text-2xl text-primary">₦{stats.revenue}</p>
        </div>
      </div>

      {/* Ord ers & Messages */}
      <div className="grid md:grid-cols-3 text-gray-600 gap-6 mb-8">
        <Link
          href={{ pathname: "/admin/orders", query: { filter: "delivered" } }}
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Delivered Orders</h2>
          <p className="text-2xl text-green-600">{stats.deliveredOrders}</p>
        </Link>
        <Link
          href={{ pathname: "/admin/orders", query: { filter: "pending" } }}
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Pending Orders</h2>
          <p className="text-2xl text-red-600">{stats.pendingOrders}</p>
        </Link>
        <Link
          href={{ pathname: "/admin/orders", query: { filter: "processing" } }}
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Unprocessed Orders</h2>
          <p className="text-2xl text-yellow-600">{stats.processingOrders}</p>
        </Link>
        <Link
          href={{ pathname: "/admin/orders", query: { filter: "shipped" } }}
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Shipped Orders</h2>
          <p className="text-2xl text-blue-600">{stats.shippedOrders}</p>
        </Link>
        <Link
          href={{ pathname: "/admin/contact", query: { filter: "pending" } }}
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Pending Messages</h2>
          <p className="text-2xl text-red-600">{stats.pendingMessages}</p>
        </Link>
        <Link
          href="/admin/reviews"
          className="bg-white hover:bg-gray-100 shadow rounded p-4 flex flex-col justify-center items-center">
          <h2 className="font-bold text-lg">Total Reviews</h2>
          <p className="text-2xl text-green-600">{stats.reviews}</p>
        </Link>
      </div>

      {/* Charts */}
      <div className="flex justify-center items-center">
        {/* Orders Trend */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-bold text-lg mb-4">Orders Trend</h2>
          <div className="w-full h-[300px]">
            {ordersTrend ? (
              <Line
                data={{
                  labels: ordersTrend.labels,
                  datasets: [
                    {
                      label: "Orders",
                      data: ordersTrend.data,
                      borderColor: "rgb(75, 192, 192)",
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p className="text-gray-500">Loading trend...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};


export default withAdminAuth(AdminDashboard);
