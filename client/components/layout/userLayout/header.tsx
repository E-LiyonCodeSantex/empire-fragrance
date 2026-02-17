import { Great_Vibes } from 'next/font/google';
import { MagnifyingGlassIcon, ShoppingCartIcon, UserPlusIcon, ArrowLeftOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/userLayout/sidebar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useModal } from "@/context/ModalContext";
import { useCart } from "@/context/useCart";
import api from "@/utils/axiosInstance";

const greatVibes = Great_Vibes({
    subsets: ['latin'],
    weight: ['400'],
});

export default function Header() {
    const { setActiveModal } = useModal();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any>(null);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoadingSearch(true);
        try {
            const { data } = await api.get(`/api/user/search?q=${searchQuery}`);
            setSearchResults(data);
        } catch (err: any) {
            setSearchResults({ error: err.response?.data?.message || "Search failed" });
        } finally {
            setLoadingSearch(false);
        }
    };

    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showHeader, setShowHeader] = useState(true);
    const router = useRouter();
    const { cartCount } = useCart();

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
        <header className={`fixed top-0 left-0 w-full z-45 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="flex justify-around items-start xs:items-center w-full h-[150px] xs:h-[100px] gap-2 py-8 xs:py-2 bg-gray-100 relative z-45 border-b-2 border-gray-300">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                {/*<Sidebar />*/}
                <a className="flex gap-2 items-center justify-center flex-wrap p-0 w-fit"
                    href="/">
                    <h1 className={`${greatVibes.className} font-extrabold text-2xl xs:text-3xl flex flex-nowrap text-secondary`}>Empire</h1>

                    <h1 className={`${greatVibes.className} font-extrabold text-2xl xs:text-3xl flex flex-nowrap text-gray-600`}>Fragrance</h1>
                </a>

                <div className="flex justify-between items-center border-2 border-gray-400 gap-2 bg-gray-300 xs:relative absolute top-20 xs:top-0 mx-4 ">
                    <MagnifyingGlassIcon className="w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] flex justify-center items-center text-primary hover:text-hoverPrimary" />
                    <input type="text"
                        placeholder="Search products by name, brands, category..."
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
                    <Link href="/user/product/cart">
                        <div className='relative'>
                            {cartCount > 0 && (
                                <span className="absolute -top-7 -right-3 rounded-full border-2 border-primary text-secondary px-1 py-0.5">
                                    {cartCount}
                                </span>
                            )}
                            <ShoppingCartIcon className="w-[20px] sm:w-[25px] h-[20px] sm:h-[25px] flex justify-center items-center text-primary" />
                        </div>
                    </Link>
                    {/* Register button */}
                    <div onClick={() => setActiveModal('register')} className="cursor-pointer">
                        <UserPlusIcon className="w-[25px] h-[25px] text-primary" />
                    </div>

                    {/* Login button */}
                    <div onClick={() => setActiveModal('login')} className="cursor-pointer">
                        <ArrowLeftOnRectangleIcon className="w-[25px] h-[25px] text-primary" />
                    </div>
                </div>
            </div>

            <div className="hidden md:flex justify-around items-center w-full absolute top-[150px] xs:top-[100px] z-40">
                <ul className='flex gap-4 text-gray-700 bg-gray-100 py-2 px-4 rounded-b-3xl shadow-md'>
                    {/*<li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/deals')? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/deals">Today Deals</a></li>*/}
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/spray') ? 'text-hoverSecondary' : 'text-gray-700'} `}><Link href="/user/product/spray">Spray</Link></li>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/popular') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/popular">Popular products</a></li>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/new') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/new">New Products</a></li>
                    <div className='relative group '>
                        <li onClick={() => setIsOpen(!isOpen)}
                            className={`font-bold pointer hover:text-hoverSecondary cursor-pointer  text-gray-700 ${isActive('/user/product/perfume/oil', '/user/product/perfume/luxury', '/user/product/perfume/designer', '/user/product/perfume/women', '/user/product/perfume/men', '/user/product/perfume/unisex') ? 'text-hoverSecondary' : 'text-gray-700'} `}>Perfume</li>
                        {isOpen && (
                            <ul className='hidden group-hover:flex flex-col justify-center items-start gap-2 absolute bg-gray-100 w-[210px] -left-15 rounded-b-xl py-4 px-6 shadow-lg z-50'>
                                <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/perfume/oil') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/perfume/oil">Oil perfumes</a></li>
                                <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/perfume/luxury') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/perfume/luxury">Luxury perfumes</a></li>
                                <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/perfume/designer') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/perfume/designer">Designer's perfumes</a></li>
                                <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/perfume/women') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/perfume/women">Women's perfumes</a></li>
                                <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/perfume/men') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/perfume/men">Men's perfumes</a></li>
                                <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/perfume/unisex') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/perfume/unisex">Unisex Perfume</a></li>
                            </ul>
                        )}
                    </div>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/ouds') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/ouds">Ouds</a></li>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/all') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/all">All Products</a></li>
                </ul>

                <ul className='flex gap-4 text-gray-700 bg-gray-100 py-2 px-4 rounded-b-3xl shadow-md'>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/account') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/account">My Account</a></li>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/product/orders') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/product/orders">My Orders</a></li>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/contact') ? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/user/contact">Contact Us</a></li>
                    <li className={`font-bold pointer hover:text-hoverSecondary cursor-pointer ${isActive('/user/about') ? 'text-hoverSecondary' : 'text-gray-700'} `}><span onClick={() => setActiveModal('forgotPassword')}>Reset Password</span></li>
                </ul>

            </div>

            {/* Results modal */}
            <div className='flex w-full justify-center items-center p-2'>
                {searchResults
                    && (
                        <div className="flex flex-col justify-center items-around bg-white shadow-lg border-2 border-gray-400 rounded-lg p-4 w-full max-w-[400px]  max-h-[400px]  z-50">
                            {/* Close button */}
                            <div className="flex justify-end mb-2">
                                <button onClick={() => setSearchResults(null)}
                                    className="text-gray-500 hover:text-red-600 font-bold"
                                >
                                    ✕ Close
                                </button>
                            </div>

                            {searchResults.error && (
                                <p className="text-red-500">{searchResults.error}</p>
                            )}

                            {searchResults.products?.length > 0 ? (
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2">Products</h3>
                                    <ul>
                                        {searchResults.products.map((p: any) => (
                                            <li key={p._id} className="text-sm text-gray-600 border-b py-1">
                                                <Link href={`/user/product/${p._id}`} className="hover:text-hoverSecondary" onClick={() => setSearchResults(null)} // close modal on click
                                                >
                                                    {p.name} – {p.brand}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                !searchResults.error && (
                                    <p className="text-gray-500 text-center">
                                        No results found for your search. Try another keyword.
                                    </p>
                                )
                            )}
                        </div>
                    )}
            </div>
        </header>
    )
}