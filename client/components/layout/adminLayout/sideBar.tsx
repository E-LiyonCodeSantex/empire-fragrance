import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useRouter } from 'next/router';
import { useModal } from "@/context/ModalContext";


type SideBarProps = {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const AdminSidebar: React.FC<SideBarProps> = ({ isOpen, toggleSidebar }) => {
    const { setActiveModal } = useModal();
    
    const router = useRouter();
    /**const isActive = (href: string) => router.pathname === href;*/
    const isActive = (...paths: string[]) => paths.includes(router.pathname);

    return (
        <div className="relative md:hidden pb-6 shadow-lg z-50">
            <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
                <Bars3Icon className="w-[30px] h-[40px] text-gray-700 font-bold hover:text-hoverSecondary z-10" />
            </button>

            <div className={`absolute w-[270px] -top-8 sm:-top-7 -left-10 xs:left-0 bg-gray-200 rounded-md flex flex-col items-center gap-2 shadow-lg transform transition-transform duration-300 ease-in-out z-50 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="w-full bg-secondary py-3 px-2 relative flex flex-wrap justify-center gap-4 items-center">
                    <p>Qiuck Navigation</p>
                    <button onClick={toggleSidebar} aria-label="close sidebar">
                        <XMarkIcon className="w-[30px] h-[30px] text-white hover:text-hoverPrimary transition duration-[100ms]" />
                    </button>
                </div>

                <div className="flex flex-col gap-2 z-40 p-2">
                    <ul className="text-gray-700 flex text-sm flex-col gap-2">
                        {/*<li className={`cursor-pointer hover:text-hoverSecondary ${isActive('/deals')? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/deals">Today Deals</a></li>*/}
                        <li className={`cursor-pointer hover:text-hoverSecondary ${isActive('/admin/product')? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/admin/product">All Products</a></li>
                        <li className={`cursor-pointer hover:text-hoverSecondary ${isActive('/admin/product/create')? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/admin/product/create">Create Product</a></li>
                        <li className={`cursor-pointer hover:text-hoverSecondary ${isActive('/admin/orders')? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/admin/orders">Orders</a></li>
                        <li className={`cursor-pointer hover:text-hoverSecondary ${isActive('/admin/shipping-rules')? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/admin/shipping-rules">Shipping Rules</a></li>
                    </ul>

                    <ul className="text-gray-700 text-sm flex flex-col gap-2 pt-2 pr-2 pb-4 pl-4">
                        <li className={`cursor-pointer hover:text-hoverSecondary ${isActive('/admin/contact')? 'text-hoverSecondary' : 'text-gray-700'} `}><a href="/admin/contact">Message</a></li>
                        <li className="cursor-pointer hover:text-hoverSecondary"><span onClick={() => setActiveModal('forgotPassword')}>Reset Password</span></li>
                    </ul>
                </div>

            </div>
        </div>
    )
}






export default AdminSidebar;