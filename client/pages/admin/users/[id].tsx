import withAdminAuth from "@/utils/withAdminAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

interface User {
    _id: string;
    userName: string;
    email: string;
    role: string;
    createdAt: string;
}

const AdminUserDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                const { data } = await api.get<User>(`/api/admin/users/${id}`);
                setUser(data);
            } catch (err: any) {
                setError(err?.response?.data?.message ?? "Failed to fetch user details");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-gray-600">
                <span className="animate-spin border-2 border-primary rounded-full w-10 h-10 flex items-center justify-center">
                    Loading...
                </span>
            </div>
        );
    }

    if (error || !user) {
        return (
            <p className="w-full h-screen flex justify-center items-center text-red-600">
                {error ? error : "User not found"}
            </p>
        );
    }

    return (
        <main className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-gray-700">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">User Details</h1>

            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <p className="mb-2"><span className="font-bold">Name:</span> {user.userName}</p>
                <p className="mb-2"><span className="font-bold">Email:</span> {user.email}</p>
                <p className="mb-2"><span className="font-bold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => router.push(`/admin/orders?user=${user._id}`)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    View Orders
                </button>
            </div>
        </main>
    );
}

export default withAdminAuth(AdminUserDetails);