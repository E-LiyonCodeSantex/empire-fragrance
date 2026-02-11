// utils/withAdminAuth.tsx
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function withAdminAuth(Component: React.FC) {
  return function ProtectedPage(props: any) {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return; // still loading

      if (!currentUser) {
        router.replace("/admin/login");
      } else if (currentUser.role !== "admin") {
        router.replace("/admin/login");
      }
    }, [currentUser, loading, router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen text-red-500">
          Checking authentication...
        </div>
      );
    }

    if (currentUser && currentUser.role === "admin") {
      return <Component {...props} />;
    }
    return null;
  };
}
