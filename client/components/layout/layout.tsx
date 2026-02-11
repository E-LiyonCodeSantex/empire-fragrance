import Footer from "@/components/layout/userLayout/footer";
import Header from "@/components/layout/userLayout/header";
import { LayoutProps } from "@/interface";
import { ModalProvider } from "@/context/ModalContext";

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
        <ModalProvider>
            <div className="w-full fixed top-0 z-50">
                <Header />
            </div>
            <div className="mt-24 bg-gray-200 min-h-[500px]">
            <main>{children}</main>
            </div>
            <Footer />
        </ModalProvider>
        </>
    )
}

export default Layout;