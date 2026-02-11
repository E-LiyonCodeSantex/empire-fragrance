import { Great_Vibes } from 'next/font/google';
import { MagnifyingGlassIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/adminLayout/sideBar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useModal } from "@/context/ModalContext";
import api from "@/utils/axiosInstance";

const greatVibes = Great_Vibes({
    subsets: ['latin'],
    weight: ['400'],
});

export default function AdminHeader() {
    const { setActiveModal } = useModal();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showHeader, setShowHeader] = useState(true);
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any>(null);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoadingSearch(true);
        try {
            const { data } = await api.get(`/api/admin/search?q=${searchQuery}`);
            setSearchResults(data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setSearchResults({ error: "No results found for your search." })
            } else {
                setSearchResults({ error: "Server error. Please try again." })
            }
        } finally {
            setLoadingSearch(false);
        }
    };

    /*const isActive = (href: string) => router.pathname === href;*/
    const isActive = (...paths: string[]) => paths.includes(router.pathname);


    const toggleSidebar = () => { setIsSidebarOpen(prev => !prev); }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowHeader(false); // scrolling down
            } else {
                setShowHeader(true); // scrolling up
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);


    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="flex justify-around items-start xs:items-center w-full h-[150px] xs:h-[100px] gap-2 py-8 xs:py-2 bg-gray-100 relative z-45 border-b-2 border-gray-300">
                <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                {/*<Sidebar />*/}
                <a className="flex gap-2 items-center justify-center flex-wrap p-0 w-fit"
                    href="/admin">
                    <h1 className={`${greatVibes.className} font-extrabold text-2xl xs:text-3xl flex flex-nowrap text-secondary`}>Empire</h1>

                    <h1 className={`${greatVibes.className} font-extrabold text-2xl xs:text-3xl flex flex-nowrap text-gray-600`}>Fragrance</h1>
                </a>

                <div className="flex justify-between items-center border-2 border-gray-400 gap-2 bg-gray-300 xs:relative absolute top-20 xs:top-0 mx-4 ">
                    <MagnifyingGlassIcon className="w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] flex justify-center items-center text-primary hover:text-hoverPrimary" />
                    <input type="text"
                        placeholder="Search products, users, orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="outline-none p-2 w-full max-w-[600px] min-w-300px] text-gray-700"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-primary hover:bg-blue-700 w-[150px] h-full p-[15px]"
                    >
                        {loadingSearch ? (
                            <div className='w-full flex justify-center items-center'>
                                <span className="w-7 h-7 border-2 border-white flex justify-center items-center rounded-full animate-spin">
                                    <XMarkIcon className='w-5 h-5 text-white' />
                                </span>
                            </div>
                        ) : "Search"}
                    </button>
                </div>

                <div className="flex gap-4 items-center justify-center px-2">
                    {/* Login button */}
                    <div onClick={() => setActiveModal('login')} className="cursor-pointer">
                        <ArrowLeftOnRectangleIcon className="w-[25px] h-[25px] text-primary" />
                    </div>
                </div>
            </div>

            <div className="hidden md:flex justify-around items-center w-full absolute top-[150px] xs:top-[100px] z-40">
                <ul className='flex gap-4 text-gray-700 bg-gray-100 py-2 px-4 rounded-b-3xl shadow-md'>
                    {/*<li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/deals')? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/deals">Today Deals</a></li>*/}
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/admin/product') ? 'text-hoverSecondary' : 'text-gray-700'} `}><Link href="/admin/product">Products</Link></li>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/admin/product/create') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/admin/product/create">Create Product</a></li>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/admin/orders') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/admin/orders">Orders</a></li>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/admin/shipping-rules') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/admin/shipping-rules">Shipping Rules</a></li>

                </ul>

                <ul className='flex gap-4 text-gray-700 bg-gray-100 py-2 px-4 rounded-b-3xl shadow-md'>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/admin/contact') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/admin/contact">Message</a></li>
                    <li className="font-bold pointer hover:text-hoverSecondary cursor-pointer "><span onClick={() => setActiveModal('forgotPassword')}>Reset Password</span></li>
                </ul>

            </div>

            <div className='flex w-full justify-center items-center p-2'>
                {searchResults && (
                    <div className="flex flex-col justify-center items-around bg-white shadow-lg border-2 border-gray-400 rounded-lg p-4 w-full max-w-[400px]  max-h-[400px]  z-50">
                        {/* Close button */}
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => setSearchResults(null)}
                                className="text-gray-500 hover:text-red-600 font-bold"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {searchResults.error && (
                            <p className="text-red-500">{searchResults.error}</p>
                        )}

                        {/* Products */}
                        {searchResults.products?.length > 0 && (
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">Products</h3>
                                <ul>
                                    {searchResults.products.map((p: any) => (
                                        <li key={p._id} className="text-sm text-gray-600 border-b py-1">
                                            <Link
                                                href={`/admin/product/${p._id}`}
                                                className="hover:text-hoverSecondary"
                                                onClick={() => setSearchResults(null)} // close modal on click
                                            >
                                                {p.name} – {p.brand}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Users */}
                        {searchResults.users?.length > 0 && (
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">Users</h3>
                                <ul>
                                    {searchResults.users.map((u: any) => (
                                        <li key={u._id} className="text-sm text-gray-600 border-b py-1">
                                            <Link
                                                href={`/admin/users/${u._id}`}
                                                className="hover:text-hoverSecondary"
                                                onClick={() => setSearchResults(null)}
                                            >
                                                {u.userName} ({u.email})
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Orders */}
                        {searchResults.orders?.length > 0 && (
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">Orders</h3>
                                <ul>
                                    {searchResults.orders.map((o: any) => (
                                        <li key={o._id} className="flex flex-col justify-center items-start gap-2 text-sm text-gray-600 py-2 border-b py-1">
                                            <Link
                                                href={`/admin/orders/${o._id}`}
                                                className="hover:text-hoverSecondary"
                                                onClick={() => setSearchResults(null)}
                                            >
                                                Order #:: {o.orderNumber} – {o.customerEmail} <span className='bg-primary text-center px-2 py-1 text-sm text-gray-100 rounded-lg'>CLick to view order</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Friendly message if no results */}
                        {!searchResults.products?.length &&
                            !searchResults.users?.length &&
                            !searchResults.orders?.length &&
                            !searchResults.error && (
                                <p className="text-gray-500 text-center">
                                    No results found for your search. Try another keyword.
                                </p>
                            )}
                    </div>
                )}
            </div>


        </header>
    )
}