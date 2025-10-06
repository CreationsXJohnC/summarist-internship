'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import BookCard from '@/components/books/BookCard';
import { BsFillPlayFill } from 'react-icons/bs';
import type { Book } from '@/data/mockBooks';

import type { RootState } from '@/store/store';

const ForYouPage = () => {
  const router = useRouter();

  const { isAuthenticated, hasHydrated } = useSelector((state: RootState) => state.auth);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const searchQuery = useSelector((state: RootState) => state.books.searchQuery);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchBooks = async () => {
      try {
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested'),
        ]);

        const selectedData = await selectedRes.json();
        const recommendedData = await recommendedRes.json();
        const suggestedData = await suggestedRes.json();

        const selected = Array.isArray(selectedData) ? selectedData[0] : selectedData;
        setSelectedBook(selected ?? null);
        setRecommendedBooks(Array.isArray(recommendedData) ? recommendedData : []);
        setSuggestedBooks(Array.isArray(suggestedData) ? suggestedData : []);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, [hasHydrated, isAuthenticated, router]);

  const filteredRecommended = recommendedBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggested = suggestedBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!hasHydrated) {
    return null;
  }
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#032b41] mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access the For You page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#032b41] mb-4">Selected just for you</h1>
          {/* Search Bar moved to Navbar */}
        </div>

        {/* Selected just for you - Screenshot style */}
        <section className="mb-12">
          <div className="bg-[#f2f4ef] text-[#032b41] rounded-xl p-6">
            <div className="flex items-center">
              {/* Left blurb */}
              <div className="flex-1 pr-8">
                <h2 className="font-semibold mb-2">How Constant Innovation Creates Radically Successful Businesses</h2>
                <p className="text-sm text-[#6b7c93]">Selected just for you</p>
              </div>

              {/* Vertical divider */}
              <div className="w-px h-24 bg-gray-300 mx-4 hidden md:block" />

              {/* Right side: cover + meta */}
              <div className="flex-1 flex items-center gap-6">
                <div className="w-20 h-28 relative overflow-hidden rounded shadow">
                  <Image src={selectedBook?.imageLink || '/assets/placeholder.png'} alt={selectedBook?.title || 'Selected Book'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{selectedBook?.title}</h3>
                  <p className="text-sm text-[#6b7c93]">{selectedBook?.author}</p>
                </div>
                {/* Play + duration label */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => selectedBook && router.push(`/book/${selectedBook.id}/listen/transcript`)}
                    className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow hover:shadow-md transition"
                    aria-label="Play"
                  >
                    <BsFillPlayFill className="text-white text-xl" />
                  </button>
                  <span className="text-sm text-[#032b41]">3 mins 23 secs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended for you */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#032b41] mb-6">Recommended for you</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredRecommended.slice(0, 5).map((book) => (
              <BookCard key={book.id} book={book} size="medium" />
            ))}
          </div>
        </section>

        {/* Suggested Books */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#032b41] mb-6">Suggested Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredSuggested.slice(0, 5).map((book) => (
              <BookCard key={book.id} book={book} size="medium" />
            ))}
          </div>
        </section>


      </div>
    </div>
  );
};

export default ForYouPage;