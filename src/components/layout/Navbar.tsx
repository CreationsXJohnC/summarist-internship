'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { openAuthModal } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { AiOutlineSearch } from 'react-icons/ai';
import { setSearchQuery } from '@/store/slices/booksSlice';

export default function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const searchQuery = useAppSelector((state) => state.books.searchQuery);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = () => {
    dispatch(openAuthModal('login'));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <nav className="h-20 bg-white border-b border-gray-200">
      <div className="max-w-[1070px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center cursor-pointer">
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
                <span className="text-gray-700 hover:text-gray-900 select-none cursor-not-allowed" aria-disabled="true" tabIndex={-1}>
                  About
                </span>
                <span className="text-gray-700 hover:text-gray-900 select-none cursor-not-allowed" aria-disabled="true" tabIndex={-1}>
                  Contact
                </span>
                <span className="text-gray-700 hover:text-gray-900 select-none cursor-not-allowed" aria-disabled="true" tabIndex={-1}>
                  Help
                </span>
              </div>
              <button
                onClick={handleLogin}
                className="bg-[#2bd97c] text-[#032b41] px-6 py-2 rounded font-medium hover:bg-[#20ba68] transition-colors cursor-pointer"
              >
                Login
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2bd97c] focus:border-transparent"
                />
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 cursor-pointer"
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