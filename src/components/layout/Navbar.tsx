'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { openAuthModal } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(openAuthModal('login'));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="h-20 bg-white border-b border-gray-200">
      <div className="max-w-[1070px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Summarist Logo"
            width={200}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          {!isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="#" className="text-gray-700 hover:text-gray-900">
                  About
                </Link>
                <Link href="#" className="text-gray-700 hover:text-gray-900">
                  Contact
                </Link>
                <Link href="#" className="text-gray-700 hover:text-gray-900">
                  Help
                </Link>
              </div>
              <button
                onClick={handleLogin}
                className="bg-[#2bd97c] text-[#032b41] px-6 py-2 rounded font-medium hover:bg-[#20ba68] transition-colors"
              >
                Login
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.displayName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}