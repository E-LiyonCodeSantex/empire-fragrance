import React, { useState } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from "@/utils/axiosInstance";

interface forgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    setActiveModal: (modal: 'register' | 'login' | 'forgotPassword' | 'verifyCode' | 'updateProfile' | null) => void;
    role: "admin" | "user";
}

const ForgotPasswordModal: React.FC<forgotPasswordModalProps> = ({ isOpen, onClose, setActiveModal, role }) => {

    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post(`/api/${role}/forgot-password`,
                { email: email.toLowerCase() } // ✅ send email, not identifier
            );

            setMessage({ type: 'success', text: "Code sent to your email!" });
            setLoading(false);

            setActiveModal('verifyCode'); 
            localStorage.setItem("resetEmail", email.toLowerCase());
            
        } catch (error) {
            setLoading(false);
            setMessage({ type: 'error', text: 'Failed to send code. Please try again.' });
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <form onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-gray-100 rounded-xl pb-4 shadow-lg w-full max-w-md"
        >

            <div className=" py-6 px-2 mb-4 text-center rounded-t-xl bg-primary flex justify-around items-center">

                <h2 className="text-2xl font-bold text-gray-200">Reset password</h2>
                <button type="button" aria-label="Close modal" onClick={onClose} className="text-gray-100 hover:text-white">
                    <XMarkIcon className="w-8 h-8" />
                </button>
            </div>

            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary ">
                <label className="block text-gray-400 font-semibold">Enter your Email</label>
                      <input 
                      type="email" 
                      value={email} 
                      onChange={(e)=>setEmail(e.target.value)} 
                      placeholder="Enter email" 
                      required
                       className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none focus:border-secondary " 
                      />

            </div>

            <div className='w-full flex flex-col justify-center items-center'>
                {message && <p className={message.type === 'error' ? 'text-red-500' : 'text-green-500'}>{message.text}</p>}
                
                <button
                    type="submit"
                    className="py-2 w- [200px] px-4 bg-primary hover:bg-hoverPrimary rounded-xl flex justify-center items-center font-bold text-white flex items-center gap-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-t-2 border-gray-100 rounded-full animate-spin">
                            <XMarkIcon className='w-4 h-4 text-gray-100' />
                        </span>
                    ) : (
                        'Send My Password'
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

export default ForgotPasswordModal;