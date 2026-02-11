import AdminFooter from "@/components/layout/adminLayout/footer";
import AdminHeader from "@/components/layout/adminLayout/header";
import { LayoutProps } from "@/interface";
import { ModalProvider } from "@/context/ModalContext";

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <ModalProvider>
                <AdminHeader />
                <div className="mt-24 bg-gray-300 min-h-screen">
                    <main>{children}</main>
                </div>
                <AdminFooter />
            </ModalProvider>
        </>
    )
}

export default AdminLayout;
