import { createContext, useContext, useState, ReactNode } from "react";
import AuthModalManager from "@/components/join/AuthModalManager";
import { useRouter } from "next/router";


const ModalContext = createContext<any>(null);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<
  null | 'register' | 'login' | 'forgotPassword' | 'verifyCode' | 'resetPassword'
  >(null);
   const router = useRouter();


   // ✅ Determine role based on route or modal type
    const role: "admin" | "user" = router.pathname.startsWith("/admin") ? "admin" : "user";

  return (
    <ModalContext.Provider value={{ activeModal, setActiveModal }}>
      {children}
      <AuthModalManager
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        onClose={() => setActiveModal(null)}
        role={role}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

