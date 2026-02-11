// pages/user/contact/index.tsx
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from "react";
import api from "@/utils/axiosInstance";

const ContactPage = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", phone: "", message: "" });
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/user/contact", form);
            setSuccess("Message submitted successfully!");
            setForm({ name: "", email: "", subject: "", phone: "", message: "" });
            setLoading(false);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Failed to submit message");
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen text-gray-800">
            {/* Hero Section */}
            <section className="w-full bg-primary text-white py-16 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="max-w-2xl mx-auto text-lg">
                    Have questions, feedback, or need support? We’d love to hear from you.
                    Fill out the form below or reach us directly through our contact details.
                </p>
            </section>

            {/* Contact Form & Info */}
            <section className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-10">
                
                {/* Contact Information */}
                <div className="flex flex-col justify-center bg-gray-50 rounded-lg p-8 shadow-md">
                    <h2 className="text-2xl font-bold text-hoverPrimary mb-6">Get in Touch</h2>
                    <p className="mb-4">
                        We’re here to help with any inquiries about our products, services, or your shopping experience.
                    </p>
                    <ul className="space-y-3 text-gray-700">
                        <li> Email: <a href="mailto:support@yourecommerce.com" className="text-hoverPrimary hover:underline">support@yourecommerce.com</a>
                        </li>
                        <li>Phone: <a href="tel:+2348001234567" className="text-hoverPrimary hover:underline">+2348001234567</a>
                        </li>
                        <li>
                            <strong>Address:</strong> 123 Commerce Street, Lagos, Nigeria
                        </li>
                    </ul>
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="text-hoverPrimary hover:underline">Facebook</a>
                            <a href="#" className="text-hoverPrimary hover:underline">Twitter</a>
                            <a href="#" className="text-hoverPrimary hover:underline">Instagram</a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 shadow-md rounded-lg p-8">
                    <div className="mb-4 w-full mb-6">
                        <h2 className="text-2xl font-bold text-hoverPrimary">Send Us a Message</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold mb-1">Name *</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-400 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hoverSecondary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-400 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hoverSecondary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Phone</label>
                            <input
                                type="number"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-400 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hoverSecondary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Subject *</label>
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-400 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hoverSecondary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Message *</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={5}
                                className="w-full border-2 border-gray-400 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hoverSecondary"
                                required
                            />
                        </div>
                        {success && <p className="text-green-600 mt-4">{success}</p>}
                        {error && <p className="text-red-600 mt-4">{error}</p>}
                        <button
                            type="submit"
                            className="py-2 w-[200px] px-4 bg-primary hover:bg-hoverPrimary rounded-xl flex justify-center items-center font-bold text-white gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-t-2 border-primary rounded-full animate-spin">
                                    <XMarkIcon className="w-4 h-4 text-primary" />
                                </span>
                            ) : (
                                'Send Message'
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
