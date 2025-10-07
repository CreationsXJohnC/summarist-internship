'use client';

import BookCard from '@/components/books/BookCard';
import { useAppSelector } from '@/store/hooks';

const LibraryPage = () => {
  const { isAuthenticated, hasHydrated } = useAppSelector((state) => state.auth);
  const savedBooks = useAppSelector((state) => state.books.library);
  const finishedBooks = useAppSelector((state) => state.books.finishedBooks);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto pr-4 pl-8 md:pl-12 lg:pl-16">
          <section className="mb-12 animate-pulse">
            <div className="h-8 w-52 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </section>

          <section className="animate-pulse">
            <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#032b41] text-lg font-medium">Log in to your account to see your library.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto pr-4 pl-8 md:pl-12 lg:pl-16">

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#032b41] mb-6">Saved Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {savedBooks.length === 0 ? (
              <div className="text-gray-600">No saved books.</div>
            ) : (
              savedBooks.map((book) => (
                <BookCard key={book.id} book={book} size="medium" />
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#032b41] mb-6">Finished</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {finishedBooks.length === 0 ? (
              <div className="text-gray-600">No finished books yet.</div>
            ) : (
              finishedBooks.map((book) => (
                <BookCard key={book.id} book={book} size="medium" />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LibraryPage;