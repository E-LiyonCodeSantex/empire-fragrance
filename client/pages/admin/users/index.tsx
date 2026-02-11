import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import withAdminAuth from "@/utils/withAdminAuth";
import Link from "next/link";

interface User {
  _id: string;
  userName: string;
  email: string;
  createdAt: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<User[]>("/api/admin/users");
        setUsers(data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 pt-14 pb-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">All Users</h1>

      {loading && <p className="text-gray-600">Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800">
                      <Link href={`/admin/users/${user._id}`} className="hover:text-hoverSecondary">
                      {user.userName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <Link href={`/admin/users/${user._id}`} className="hover:text-hoverSecondary">
                      {user.email}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <Link href={`/admin/users/${user._id}`} className="hover:text-hoverSecondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default withAdminAuth(AdminUsersPage);
