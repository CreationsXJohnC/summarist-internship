'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookCard from '@/components/books/BookCard';
import { getRecommendedBooks, getSuggestedBooks, Book } from '@/data/mockBooks';
import { AiOutlineSearch } from 'react-icons/ai';

const ForYouPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Load book data
    setRecommendedBooks(getRecommendedBooks());
    setSuggestedBooks(getSuggestedBooks());
  }, [isAuthenticated, router]);

  const filteredRecommended = recommendedBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggested = suggestedBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-[#032b41] mb-4">For You</h1>
          <p className="text-gray-600 mb-6">
            Discover your next favorite book with personalized recommendations
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2bd97c] focus:border-transparent"
            />
          </div>
        </div>

        {/* Selected Book of the Day */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#032b41] to-[#2bd97c] rounded-lg p-8 text-white">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/3">
                <div className="w-48 h-72 mx-auto relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={recommendedBooks[0]?.imageLink}
                    alt={recommendedBooks[0]?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="lg:w-2/3 text-center lg:text-left">
                <h2 className="text-2xl font-bold mb-2">Selected just for you</h2>
                <h3 className="text-xl font-semibold mb-4">{recommendedBooks[0]?.title}</h3>
                <p className="text-lg mb-4">by {recommendedBooks[0]?.author}</p>
                <p className="text-gray-200 mb-6 leading-relaxed">
                  {recommendedBooks[0]?.summary}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="bg-white text-[#032b41] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Read
                  </button>
                  <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#032b41] transition-colors">
                    Listen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended for you */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#032b41] mb-6">Recommended for you</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredRecommended.slice(1).map((book) => (
              <BookCard key={book.id} book={book} size="medium" />
            ))}
          </div>
        </section>

        {/* Suggested Books */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#032b41] mb-6">Suggested Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredSuggested.map((book) => (
              <BookCard key={book.id} book={book} size="medium" />
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        <section>
          <h2 className="text-2xl font-bold text-[#032b41] mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Self-Help', 'Business', 'Psychology', 'Productivity', 'Leadership', 'Entrepreneurship', 'Mindfulness', 'Success'].map((category) => (
              <div
                key={category}
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-[#2bd97c]"
              >
                <h3 className="font-semibold text-[#032b41] hover:text-[#2bd97c] transition-colors">
                  {category}
                </h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ForYouPage;