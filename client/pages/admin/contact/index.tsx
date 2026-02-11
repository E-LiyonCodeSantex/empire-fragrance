import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import withAdminAuth from "@/utils/withAdminAuth";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
}

const AdminMessagesPage = () => {
  const router = useRouter();
  const initialFilter = (router.query.filter as string) || "all";

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get<Message[]>("/api/admin/messages");
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const resolveMessage = async (id: string) => {
    try {
      await api.patch(`/api/admin/messages/${id}/resolve`);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: "resolved" } : m))
      );
    } catch (err) {
      console.error("Failed to resolve message", err);
    }
  };

  // Update filter when query changes
  useEffect(() => {
    if (router.query.filter) {
      setFilter(router.query.filter as string);
    }
  }, [router.query.filter]);

  const filteredMessages =
    filter === "all" ? messages : messages.filter((m) => m.status === filter);

  return (
    <main className="max-w-5xl mx-auto px-2 pt-14 pb-6">
      <div className="mb-6 w-full">
        <h1 className="text-3xl font-bold text-gray-700">User Messages</h1>
        <span className="text-sm text-primary">
          Note: Resolved messages will be deleted automatically after 30 days.
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <span className="w-10 h-10 border-2 border-t-2 border-primary rounded-full animate-spin flex items-center justify-center">
            <XMarkIcon className="w-6 h-6 text-primary" />
          </span>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-600">
          <p className="text-lg font-medium">No messages have been sent yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Once users submit inquiries or feedback, they will appear here for
            you to review.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-300">
          {filteredMessages.length === 0 ? (
            <p className="p-4 text-gray-600">
              No {filter} messages found.
            </p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left text-gray-700">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">Message</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-gray-50 text-gray-700">
                    <td className="p-2 border">{msg.name}</td>
                    <td className="p-2 border text-primary">
                      <a href={`mailto:${msg.email}`}>{msg.email}</a>
                    </td>
                    <td className="p-2 border">{msg.phone ?? "-"}</td>
                    <td className="p-2 border min-w-[150px]">
                      {msg.subject ?? "-"}
                    </td>
                    <td className="p-2 border min-w-[250px]">{msg.message}</td>
                    <td className="p-2 border">
                      <span
                        className={`px-3 py-1 rounded text-sm font-bold ${
                          msg.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {msg.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2 border">
                      {msg.status === "pending" && (
                        <button
                          onClick={() => resolveMessage(msg._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
};

export default withAdminAuth(AdminMessagesPage);
