import React, { useState } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";


interface UpdateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    setActiveModal: (modal: 'register' | 'login' | 'forgotPassword' | 'verifyCode' | 'resetPassword' | null) => void;
    role: "admin" | "user";
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isOpen, onClose, setActiveModal, role }) => {

    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const { currentUser, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        newUserName: currentUser?.userName || "",
        newEmail: currentUser?.email || "",
        currentPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.put(`/api/${role}/update`, formData)
            await refreshUser();
            setTimeout(() => onClose(), 1500);
        } catch (error: any) {
            const backendMessage = error.response?.data?.message || "Update failed. Please try again.";
            setMessage({ type: "error", text: backendMessage })
        } finally {
            setLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <form onClick={(e) => e.stopPropagation()}
            onSubmit={handleUpdate}
            className="bg-gray-100 rounded-xl pb-4 shadow-lg w-full max-w-md"
        >

            <div className=" py-6 px-2 mb-4 text-center rounded-t-xl bg-primary flex justify-around items-center">

                <h2 className="text-2xl font-bold text-gray-200">Update Profile</h2>
                <button type="button" aria-label="Close modal" onClick={onClose} className="text-gray-100 hover:text-white">
                    <XMarkIcon className="w-8 h-8" />
                </button>
            </div>

            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary ">
                <label className="block text-gray-400 font-semibold">New Email</label>
                <input
                    type="email"
                    name="newEmail"
                    value={formData.newEmail}
                    onChange={handleChange}
                    placeholder="Enter new email"
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none focus:border-secondary "
                />
            </div>
            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary ">
                <label className="block text-gray-400 font-semibold">New UserName</label>
                <input
                    type="text"
                    name="newUserName"
                    value={formData.newUserName}
                    onChange={handleChange}
                    placeholder="Enter new username"
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none focus:border-secondary "
                />
            </div>
            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary ">
                <label className="block text-gray-400 font-semibold">Confirm Password</label>
                <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current Password"
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none focus:border-secondary "
                    required
                />
            </div>

            <div className='w-full flex flex-col justify-center items-center'>
                {message && <p className={message.type === 'error' ? 'text-red-500' : 'text-green-500'}>{message.text}</p>}

                <button
                    type="submit"
                    className="py-2 w-[200px] px-4 bg-primary hover:bg-hoverPrimary rounded-xl flex justify-center items-center font-bold text-white flex items-center gap-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-t-2 border-gray-100 rounded-full animate-spin">
                            <XMarkIcon className='w-4 h-4 text-gray-100' />
                        </span>
                    ) : (
                        'Update Profile'
                    )}
                </button>
            </div>
        </form>
    );
}

export default UpdateProfileModal;