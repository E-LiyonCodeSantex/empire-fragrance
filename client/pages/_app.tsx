// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserLayout from "@/components/layout/layout";
import AdminLayout from "@/components/layout/adminLayout/layout";
import { useRouter } from "next/router";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/useCart";


const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
        {isAdminRoute ? (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : (
          <UserLayout>
            <Component {...pageProps} />
          </UserLayout>
        )}
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
