// AuthModalManager.tsx
import UserRegisterModal from "@/components/join/userRegisterModal";
import UserLoginModal from "@/components/join/login";
import ForgotPasswordModal from "@/components/join/forgotPassword";
import VerifyCodeModal from "@/components/join/verifyCode";
import ResetPasswordModal from "@/components/join/resetPassword";
import UpdateProfileModal from "@/components/join/updateProfile";
import React from "react";

interface AuthModalManagerProps {
  onClose: () => void;
  activeModal: 'register' | 'login' | 'forgotPassword' | 'verifyCode' | 'resetPassword' | 'updateProfile' | null;
  setActiveModal: (modal: 'register' | 'login' | 'forgotPassword' | 'verifyCode' | 'resetPassword' | 'updateProfile' | null) => void;
  role: "admin" | "user";
}

const AuthModalManager: React.FC<AuthModalManagerProps> = ({ onClose, activeModal, setActiveModal, role }) => {
  if (!activeModal) return null;

  return (
    <div onClick={onClose}
    className="w-full h-screen fixed px-3 top-0 left-0 bg-black/50 flex justify-center items-center z-50">
      {activeModal === 'register' && (
        <UserRegisterModal isOpen={true} onClose={() => setActiveModal(null)} setActiveModal={setActiveModal} />
      )}
      {activeModal === 'login' && (
        <UserLoginModal isOpen={true} onClose={() => setActiveModal(null)} setActiveModal={setActiveModal} role={role} />
      )}
      {activeModal === 'forgotPassword' && (
        <ForgotPasswordModal isOpen={true} onClose={() => setActiveModal(null)} setActiveModal={setActiveModal} role={role} />
      )}
      {activeModal === 'verifyCode' && (
        <VerifyCodeModal isOpen={true} onClose={() => setActiveModal(null)} setActiveModal={setActiveModal} role={role} />
      )}
      {activeModal === 'resetPassword' && (
        <ResetPasswordModal isOpen={true} onClose={() => setActiveModal(null)} setActiveModal={setActiveModal} role={role} />
      )}
      {activeModal === 'updateProfile' && (
        <UpdateProfileModal isOpen={true} onClose={() => setActiveModal(null)} setActiveModal={setActiveModal} role={role} />
      )}
    </div>
  );
};

export default AuthModalManager;
