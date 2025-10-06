'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { openAuthModal } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { AiOutlineSearch, AiFillStar } from 'react-icons/ai';
import { setSearchQuery } from '@/store/slices/booksSlice';


// Suggestions dropdown component
const SuggestionsList = ({ query, sourceBooks, onSelect }: { query: string; sourceBooks: Array<{ id: string; title: string; author: string; imageLink: string; averageRating: number; keyIdeas: number; tags: string[] }>; onSelect: (id: string) => void }) => {
  const normalized = query.trim().toLowerCase();
  const results = sourceBooks
    .map((b) => {
      const title = b.title.toLowerCase();
      const author = b.author.toLowerCase();
      let score = 0;
      if (title.includes(normalized)) score += 2;
      if (author.includes(normalized)) score += 1;
      if (title.startsWith(normalized)) score += 3;
      if (author.startsWith(normalized)) score += 2;
      return { book: b, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((r) => r.book);

  if (results.length === 0) {
    return (
      <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow z-50 p-3 text-sm text-gray-600">
        No results
      </div>
    );
  }

  return (
    <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow z-50">
      <ul className="max-h-80 overflow-auto">
        {results.map((b) => (
          <li
            key={b.id}
            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(b.id);
            }}
          >
            <div className="w-8 h-12 flex-shrink-0 overflow-hidden rounded">
              <Image src={b.imageLink || '/assets/placeholder.svg'} alt={b.title} width={32} height={48} className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[#032b41] text-sm font-medium truncate">{b.title}</div>
              <div className="text-xs text-gray-600 truncate">{b.author}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <AiFillStar className="text-yellow-400" />
                  {b.averageRating}
                </span>
                <span className="text-xs text-gray-400">{b.keyIdeas} ideas</span>
                <span className="text-xs text-gray-400 truncate">
                  {b.tags.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const searchQuery = useAppSelector((state) => state.books.searchQuery);
  const recommendedBooks = useAppSelector((state) => state.books.recommendedBooks);
  const suggestedBooks = useAppSelector((state) => state.books.suggestedBooks);
  const sourceBooks = React.useMemo(() => [...recommendedBooks, ...suggestedBooks], [recommendedBooks, suggestedBooks]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showSuggestions, setShowSuggestions] = React.useState(false);

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
              <div className="relative w-64" onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}>
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for books"
                  value={searchQuery.trim() === '' ? '' : searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2bd97c] focus:border-transparent text-sm placeholder:text-sm placeholder:text-gray-600 text-[#032b41] caret-[#032b41]"
                />
                {/* Suggestions dropdown */}
                {showSuggestions && searchQuery.trim() !== '' && (
                  <SuggestionsList query={searchQuery} sourceBooks={sourceBooks} onSelect={(id) => router.push(`/book/${id}`)} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}