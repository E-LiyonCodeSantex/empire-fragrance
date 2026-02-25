import React, { useState, useEffect } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from "@/utils/axiosInstance";
import emailjs from "emailjs-com";

interface resetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    setActiveModal: (modal: 'register' | 'login' | 'forgotPassword' | 'verifyCode' | 'resetPassword' | null
    ) => void;
    role: "admin" | "user";
}

const ResetPasswordModal: React.FC<resetPasswordModalProps> = ({ 
    isOpen, 
    onClose, 
    setActiveModal, 
    role 
}) => {

    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState(""); 
    const [code, setCode] = useState(""); 

    useEffect(() => { 
        if (typeof window !== "undefined") { 
            setEmail(localStorage.getItem("resetEmail") ?? ""); 
            setCode(localStorage.getItem("resetCode") ?? ""); 
        } 
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }
        try {
            setLoading(true);
            await api.post(`/api/${role}/reset-password`, {
                email,
                code,
                newPassword
            });

            setMessage({ type: 'success', text: "Password reset successfully!" });
            setActiveModal('login');
        } catch (error) {
            setLoading(false);
            setMessage({ type: 'error', text: 'Failed to reset password. Please try again.' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <form onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-gray-100 rounded-xl pb-4 shadow-lg w-full max-w-md"
        >

            <div className=" py-6 px-2 mb-4 text-center rounded-t-xl bg-primary flex justify-around items-center">

                <h2 className="text-2xl font-bold text-gray-200">Reset Password</h2>
                <button type="button" aria-label="Close modal" onClick={onClose} className="text-gray-100 hover:text-white">
                    <XMarkIcon className="w-8 h-8" />
                </button>
            </div>

            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary ">
                <label className="block text-gray-400 font-semibold">Email</label>
                <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none focus:border-secondary "
                />
            </div>
            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary ">
                <label className="block text-gray-400 font-semibold">code</label>
                <input
                    type="text"
                    value={code}
                    disabled
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none focus:border-secondary "
                />
            </div>
            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary ">
                <label className="block text-gray-400 font-semibold">Enter New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none focus:border-secondary "
                    required
                />
            </div>
            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary ">
                <label className="block text-gray-400 font-semibold">Confirm password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
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
                        'Reset Password'
                    )}
                </button>
                {
                    role === 'user' && (
                        <a href="#" className="text-gray-600 hover:text-gray-800 mt-2 text-sm">Privacy Policy</a>
                    )
                }
                <span onClick={() => setActiveModal('login')}
                    className="text-gray-600 hover:text-hoverSecondary cursor-pointer mt-2">Back to login</span>
            </div>
        </form>
    );
}

export default ResetPasswordModal;



/**
 *   // ✅ Pull email + code from localStorage 
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");

    // ✅ Load values from localStorage (set earlier when user requested reset) 
    useEffect(() => {
        if (typeof window !== "undefined") {
            setEmail((localStorage.getItem("resetEmail") ?? "").toLowerCase());
            setCode(localStorage.getItem("resetCode") ?? "");
        }
    }, []);

    // ✅ Send reset email via EmailJS 
    const sendResetEmail = async (userEmail: string, resetCode: string) => {
        try {
            await emailjs.send(
                "your_service_id", // from EmailJS dashboard 
                "your_template_id", // template with {{userEmail}} and {{resetCode}} 
                {
                    userEmail,
                    resetCode,
                },
                "your_public_key" // from EmailJS account 
            );
            console.log("Reset email sent successfully");
        } catch (err) {
            console.error("Failed to send reset email:", err);
        }
    };
 */