import withAdminAuth from "@/utils/withAdminAuth";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ResetPasswordProps {
  role: "admin" | "user";
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ role }) => {
  const router = useRouter();
  const { token } = router.query; // token comes from URL: /admin/reset-password/[token]

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/${role}/reset-password/:token`, {
        token,
        newPassword: formData.newPassword,
      });

      setMessage({ type: "success", text: "Password reset successful! Redirecting to login..." });
      setLoading(false);

      setTimeout(() => {
        router.push(role === "admin" ? "/admin/login" : "/login");
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Password reset failed. Try again.",
      });
    }
  };

  return (
    <div className="w-full bg-gray-100 min-h-[400px] pt-14 pb-4 px-2 flex flex-col justify-center items-center gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col pb-4 justify-center items-center bg-white shadow-lg rounded-xl w-full max-w-md"
      >
        <div className="w-full pt-2 px-4 text-center rounded-t-xl bg-primary flex flex-col justify-center items-center">

          <div className="w-full pb-2 text-center flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-200">Reset Password</h2>
          </div>
        </div>

        {/* New Password */}
        <div className="m-2 w-full px-4">
          <label className="block text-gray-600 font-semibold">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border text-gray-700 rounded px-3 py-2 focus:outline-none focus:border-primary"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="m-2 w-full px-4">
          <label className="block text-gray-600 font-semibold">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border text-gray-700 rounded px-3 py-2 focus:outline-none focus:border-primary"
            required
          />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 text-center ${message.type === "error" ? "text-red-500" : "text-green-600"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="py-2 w-[200px] px-4 bg-primary hover:bg-hoverPrimary rounded-xl flex justify-center items-center font-bold text-white flex items-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-t-2 border-gray-100 rounded-full animate-spin">
              <XMarkIcon className='w-4 h-4 text-gray-100' />
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
