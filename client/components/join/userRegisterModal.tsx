import React, { useState } from 'react';
import axios from 'axios';
import { RegisterUserProps } from '@/interface/index';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface UserRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    setActiveModal: (modal: 'register' | 'login' | 'forgotPassword' | null) => void;
}

const UserRegisterModal: React.FC<UserRegisterModalProps> = ({ isOpen, onClose, setActiveModal }) => {
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const [formData, setFormData] = useState<RegisterUserProps>({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.termsAccepted) {
            setMessage({ type: 'error', text: 'Please accept the terms and policy.' });
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, formData);
            setMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
            setLoading(false);
            setTimeout(() => {
                setActiveModal('login'); // switch to login modal
            }, 1500);
        } catch (error: any) {
            setLoading(false);
            if (error.response?.status === 409) {
                setMessage({
                    type: 'error',
                    text: 'That email or username is already registered. Try logging in instead!',
                });
            } else {
                setMessage({
                    type: 'error',
                    text: 'Registration failed. Please try again.',
                });
            }
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-gray-100 rounded-xl pb-4 shadow-lg w-full max-w-md"
        >
            <div className="py-6 px-2 mb-4 text-center rounded-t-xl bg-primary flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-200">Create Account</h2>
                <button type="button" aria-label="Close modal" onClick={onClose} className="text-gray-100 hover:text-white">
                    <XMarkIcon className="w-8 h-8" />
                </button>
            </div>

            {/* Username */}
            <div className="mb-2 border-b-2 px-4 border-gray-600 hover:border-secondary">
                <label className="block text-gray-400 font-semibold">Username</label>
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none focus:border-secondary"
                    required
                />
            </div>

            {/* Email */}
            <div className="mb-2 border-b-2 px-4 border-gray-600">
                <label className="block text-gray-400 font-semibold">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none"
                    required
                />
            </div>

            {/* Password */}
            <div className="mb-2 border-b-2 px-4 border-gray-600">
                <label className="block text-gray-400 font-semibold">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none"
                    required
                />
            </div>

            {/* Confirm Password */}
            <div className="mb-4 border-b-2 px-4 border-gray-600">
                <label className="block text-gray-400 font-semibold">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pt-2 text-gray-700 bg-transparent rounded focus:outline-none"
                    required
                />
            </div>

            {/* Terms */}
            <div className="mb-2 px-4 flex items-center">
                <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mr-2"
                />
                <label className="text-gray-700 text-sm">
                    I agree to the <span className="text-primary hover:text-hoverPrimary cursor-pointer">Terms</span> and{' '}
                    <span className="text-primary hover:text-hoverPrimary cursor-pointer">Policy</span>
                </label>
            </div>

            {/* Messages */}
            <div className="w-full flex justify-center items-center px-4">
                {message && (
                    <div style={{ color: message.type === 'error' ? 'red' : 'green' }}>
                        {message.text}
                    </div>
                )}
            </div>

            {/* Switch to login */}
            <span
                onClick={() => setActiveModal('login')}
                className="cursor-pointer text-gray-600 hover:text-hoverSecondary mb-3 text-sm flex justify-center items-center"
            >
                Already registered? Login
            </span>

            {/* Submit */}
            <div className="w-full flex justify-center items-center">
                <button
                    type="submit"
                    className="py-2 w-[200px] px-4 bg-primary hover:bg-hoverPrimary rounded-xl flex justify-center items-center font-bold text-white gap-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-t-2 border-gray-100 rounded-full animate-spin">
                            <XMarkIcon className="w-4 h-4 text-gray-100" />
                        </span>
                    ) : (
                        'Register'
                    )}
                </button>
            </div>
        </form>
    );
};

export default UserRegisterModal;
