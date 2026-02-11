import React, { useState } from "react";
import { useRouter } from "next/router";
import { XMarkIcon, ArrowRightEndOnRectangleIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Head from "next/head";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import Link from "next/link";



// -------------------- PAGE --------------------
const AccountPage: React.FC = () => {
  const { currentUser, loading, logout } = useAuth();
  const { setActiveModal } = useModal();

  const router = useRouter();

const [formData, setFormData] = useState({
  userName: currentUser?.userName || "",
  email: currentUser?.email || ""
});


  const handleLogout = () => {
    alert("Are you sure you want to logout?");
    logout();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-t-2 border-primary flex justify-center items-center rounded-full animate-spin">
          <XMarkIcon className='w-8 h-8 text-primary' />
        </span>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Account</title>
      </Head>

      <main className="w-full flex pt-16 pb-6 px-3">
        {currentUser ? (
          <div className="flex flex-col justify-center items-start w-full gap-4 px-4 md:px-6">
            {/* Header */}
            <div className="flex flex-col w-full md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    Welcome, {currentUser?.userName}
                  </h1>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex justify-center items-center w-full px-4 py-2 rounded-lg bg-gray-800 hover:bg-black text-white"
              >
                <ArrowRightEndOnRectangleIcon className="w-5 h-5" /> Logout
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-start gap-4">

              <section className="w-full max-w-md text-gray-700 bg-gray-50 p-4 rounded-lg shadow flex flex-col gap-2 justify-start items-center">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-fit h-fit" />
                  <h2 className="font-bold">Profile</h2>
                </div>
                <div className="flex flex-col justify-center items-start gap-2">
                  <p>Email: {currentUser?.email}</p>
                  <p>Username: {currentUser?.userName}</p>
                </div>
                <button onClick={() => setActiveModal('updateProfile')}
                  className="font-bold text-gray-100 bg-primary hover:bg-hoverPrimary py-2 px-4 cursor-pointer rounded">
                  Update Profile
                </button>
                {/* Add form to update profile */}
              </section>

              <section className="w-full max-w-md text-gray-700 bg-gray-50 p-4 rounded-lg shadow flex flex-col gap-2 justify-start items-center">
                <div className="flex items-center gap-2">
                  <LockClosedIcon className="w-5 h-5" />
                  <h2 className="font-bold">Security</h2>
                </div>
                <p onClick={() => setActiveModal('forgotPassword')}
                  className="font-bold text-gray-100 bg-primary hover:bg-hoverPrimary py-2 px-4 cursor-pointer rounded">
                  Reset Password
                </p>
              </section>

                <Link
                  href="/user/product/orders"
                  className="w-full max-w-md text-gray-700 bg-gray-50 border-2 border-gray-50 hover:border-2 hover:border-gray-700 hover:bg-white shadow rounded-lg p-4 flex flex-col justify-start items-center">
                  <h2 className="font-bold text-lg"> Total Orders</h2>
                  <p className="text-2xl text-green-600">TotalOrder</p>
                </Link>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-white text-gray-700 rounded-lg shadow gap-4">
            <h2 className="text-xl font-bold">Guest Account</h2>
            <p>You’re browsing as a guest. Sign up or log in to unlock full account features.</p>
            <div className="w-full flex gap-2 justify-around items-center">
              <button onClick={() => setActiveModal('login')}
                className="mt-4 px-4 py-2 bg-primary hover:bg-hoverPrimary text-white rounded">
                Login
              </button>
              <button onClick={() => setActiveModal('register')}
                className="mt-4 px-4 py-2 bg-primary hover:bg-hoverPrimary text-white rounded">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AccountPage;

