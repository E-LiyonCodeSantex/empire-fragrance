// pages/admin/login.tsx
import { useModal } from "@/context/ModalContext";

export default function AdminLoginPage() {
  const { setActiveModal } = useModal();

  // Open the login modal immediately
  return (
    <div className="flex flex-col gap-4 items-center h-screen justify-center h-screen bg-gray-100 z-60 p-2">
      <p className="text-gray-700">You have to login as admin to access this page.</p>
      <button
        onClick={() => setActiveModal("login")}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        Open Admin Login
      </button>
    </div>
  );
}
