'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Book, addToLibrary, removeFromLibrary, addToFinished } from '@/store/slices/booksSlice';
import { AiFillClockCircle, AiFillBook } from 'react-icons/ai';
import { BiCrown } from 'react-icons/bi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { MdTextIncrease, MdTextDecrease } from 'react-icons/md';

const ReadingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [book, setBook] = useState<Book | null>(null);
  const dispatch = useAppDispatch();
  const library = useAppSelector((state) => state.books.library);
  const finishedBooks = useAppSelector((state) => state.books.finishedBooks);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [readingProgress, setReadingProgress] = useState(0);

  // Use the book's own description or summary for reading content
  const readingText = (book?.bookDescription && book.bookDescription.trim().length > 0)
    ? book.bookDescription
    : (book?.summary || '');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const bookId = params.id as string;

    const fetchBookById = async () => {
      try {
        const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data as Book);
          return;
        }
      } catch {
        // ignore and try fallback
      }

      try {
        const statuses = ['selected', 'recommended', 'suggested'];
        const responses = await Promise.all(
          statuses.map((s) => fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooks?status=${s}`))
        );
        for (const r of responses) {
          if (!r.ok) continue;
          const list = await r.json();
          const found = Array.isArray(list) ? (list as Book[]).find((b) => b.id === bookId) : null;
          if (found) {
            setBook(found);
            return;
          }
        }
        router.push('/for-you');
      } catch (error) {
        console.error('Failed to fetch book by id', error);
        router.push('/for-you');
      }
    };

    fetchBookById();
  }, [params.id, isAuthenticated, router]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (book) {
      setIsBookmarked(library.some((b) => b.id === book.id));
    } else {
      setIsBookmarked(false);
    }
  }, [book, library]);

  const handleBookmark = () => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (book) {
      if (isBookmarked) {
        dispatch(removeFromLibrary(book.id));
        setIsBookmarked(false);
      } else {
        dispatch(addToLibrary(book));
        setIsBookmarked(true);
      }
    }
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 14));
  };

  // Auto-mark as finished when near end
  useEffect(() => {
    if (!book) return;
    if (readingProgress >= 95) {
      const isFinished = finishedBooks.some((b) => b.id === book.id);
      if (!isFinished) {
        dispatch(addToFinished(book));
      }
    }
  }, [readingProgress, book, finishedBooks, dispatch]);

  // If not authenticated, routing logic elsewhere should open modal or redirect; don't replace page with a full-screen block.

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#032b41] mb-4">Book Not Found</h2>
          <p className="text-gray-600">The book you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-[#2bd97c] transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-1 bg-white shadow-sm border-b z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-[#032b41] hover:text-[#2bd97c] transition-colors"
              >
                ← Back
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative overflow-hidden rounded">
                  <Image
                    src={book.imageLink}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <h1 className="font-semibold text-[#032b41] text-sm">{book.title}</h1>
                  <p className="text-gray-600 text-xs">{book.author}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Font Size Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseFontSize}
                  className="p-2 text-[#032b41] hover:text-[#2bd97c] transition-colors"
                  title="Decrease font size"
                >
                  <MdTextDecrease className="text-lg" />
                </button>
                <span className="text-sm text-gray-600">{fontSize}px</span>
                <button
                  onClick={increaseFontSize}
                  className="p-2 text-[#032b41] hover:text-[#2bd97c] transition-colors"
                  title="Increase font size"
                >
                  <MdTextIncrease className="text-lg" />
                </button>
              </div>

              <button
                onClick={handleBookmark}
                className="p-2 text-[#032b41] hover:text-[#2bd97c] transition-colors"
                title="Bookmark"
              >
                {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Book Header */}
          <div className="text-center mb-12">
            <div className="w-32 h-48 mx-auto mb-6 relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src={book.imageLink}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {book.subscriptionRequired && (
                <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1">
                  <BiCrown className="text-white text-sm" />
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-[#032b41] mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{book.author}</p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <AiFillClockCircle />
                <span>{book.keyIdeas} key ideas</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <AiFillBook />
                <span className="capitalize">{book.type}</span>
              </div>
            </div>
          </div>

          {/* Reading Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
            <div 
              className="prose prose-lg max-w-none leading-relaxed text-gray-800"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
            >
              {readingText
                .split(/\n\n|\r\n\r\n/)
                .filter((p) => p.trim().length > 0)
                .map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph.trim()}
                  </p>
                ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t">
            <button
              onClick={() => router.push(`/book/${book.id}`)}
              className="bg-gray-100 text-[#032b41] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              ← Back to Book Details
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Reading Progress</p>
              <div className="text-lg font-semibold text-[#2bd97c]">
                {Math.round(readingProgress)}%
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/book/${book.id}/listen`)}
              className="bg-[#2bd97c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#25c470] transition-colors"
            >
              Listen Instead →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;