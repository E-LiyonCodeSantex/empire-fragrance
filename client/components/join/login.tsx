import { loginUserProps } from "@/interface";
import React, { useState } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";


interface UserLoginModalProp {
    isOpen: boolean;
    onClose: () => void;
    setActiveModal: (modal: 'register' | 'login' | 'forgotPassword' | null) => void;
    role: "admin" | "user";
}

const UserLoginModal: React.FC<UserLoginModalProp> = ({
    isOpen,
    onClose,
    setActiveModal,
    role
}) => {
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

    const [formData, setFormData] = useState<loginUserProps>({
        email: '',
        password: '',
        rememberMe: false,
    })

    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { refreshUser } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setMessage({ type: "error", text: "Please input your email and password." });
            return;
        }

        setLoading(true);

        try {
            interface LoginResponse {
                token: string;
                message?: string;
                user?: {
                    id?: string;
                    _id?: string;
                    email: string;
                    role: "admin" | "user";
                };
            }

            const res = await api.post<LoginResponse>(`/api/${role}/login`,
                formData
            );

            const { token, message: backendMessage, user } = res.data;

            localStorage.setItem("authToken", token);

            localStorage.setItem("role", role);

            // ✅ Save user only if backend returned it
            if (user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: user.id || user._id, // handle both id/_id
                        email: user.email,
                        role: user.role || role,
                    })
                );
            }

            await refreshUser();

            setMessage({ type: "success", text: backendMessage || "Login successful!" });
            setLoading(false);
            setTimeout(() => {
                onClose();
                if (role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/")
                }
            }, 1500 );
        } catch (error: any) {
            setLoading(false);
            const backendMessage =
                error.response?.data?.message || "Login failed. Please try again.";
            setMessage({ type: "error", text: backendMessage });
            console.error("Login error:", error.response?.data || error.message);
        }
    };


    if (!isOpen) return null;

    return (
        <form onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-gray-100 rounded-xl pb-4 shadow-lg w-full max-w-md"
        >
            <div className="w-full pt-2 px-2 mb-4 text-center rounded-t-xl bg-primary flex flex-col justify-center items-center">

                <div className="w-full pb-2 text-center flex justify-between items-center border-b-2 border-gray-400">
                    <h2 className="text-2xl font-bold text-gray-200">Login</h2>
                    <button type="button" aria-label="Close modal" onClick={onClose} className="text-gray-100 hover:text-white">
                        <XMarkIcon className="w-8 h-8" />
                    </button>
                </div>
                <span className="text-gray-200 py-3">Please login </span>
            </div>

            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary ">
                <label className="block text-gray-400 font-semibold">Enter your email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none focus:border-secondary "
                    required
                />
            </div>

            <div className="mb-2 border-b-2 px-4 border-gray-600">
                <label className="block text-gray-400 font-semibold">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="w-full pt-2 text-gray-700 bg-transparent focus:outline-none focus:none"
                    required
                />
            </div>

            <div className="mb-6 px-4 flex items-center">
                <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="mr-2"
                />
                <label className="text-gray-700 text-sm">
                    Remember
                </label>
            </div>

            <div className="w-full flex justify-center items-center px-4">
                {message && (
                    <div style={{ color: message.type === 'error' ? 'red' : 'green' }}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className='w-full flex flex-col justify-center items-center'>
                <button
                    type="submit"
                    className="py-2 w-[200px] px-4 bg-primary hover:bg-hoverPrimary rounded-xl flex justify-center items-center font-bold text-white flex items-center gap-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-t-2 border-gray-100 rounded-full animate-spin">
                            <XMarkIcon className='w-4 h-4 text-gray-100' />
                        </span>
                    ) : (
                        'Login'
                    )}
                </button>
                <span
                    onClick={() => setActiveModal('forgotPassword')}
                    className="cursor-pointer text-gray-600 hover:text-hoverSecondary mt-2 text-sm"
                >
                    Forgot your password? Get help
                </span>
                <span
                    onClick={() => setActiveModal('register')}
                    className="cursor-pointer text-gray-600 hover:text-hoverSecondary mt-2 text-sm"
                >
                    Don't have an account? Sign up
                </span>
            </div>
        </form>

    );
}

export default UserLoginModal;