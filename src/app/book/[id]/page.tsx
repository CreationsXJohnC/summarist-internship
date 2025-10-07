'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Book, addToLibrary, removeFromLibrary } from '@/store/slices/booksSlice';
import { AiFillStar, AiFillClockCircle, AiFillPlayCircle, AiFillBook } from 'react-icons/ai';
import { BiCrown } from 'react-icons/bi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { openAuthModal } from '@/store/slices/uiSlice';

const BookDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasHydrated, user } = useAppSelector((state) => state.auth);
  const [book, setBook] = useState<Book | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'details'>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const library = useAppSelector((state) => state.books.library);

  useEffect(() => {
    if (!hasHydrated) return;
    const bookId = params.id as string;
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
        if (!res.ok) throw new Error('Failed to fetch book');
        const data = await res.json();
        setBook(data as Book);
      } catch {
        router.push('/for-you');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [hasHydrated, params.id, router]);

  useEffect(() => {
    if (book) {
      setIsBookmarked(library.some((b) => b.id === book.id));
    } else {
      setIsBookmarked(false);
    }
  }, [book, library]);

  const handleBookmark = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('login'));
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

  const handleRead = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('login'));
      return;
    }
    if (!book) return;
    const isPremium = !!book.subscriptionRequired;
    const isSubscribed = user?.subscription?.status === 'active';
    if (isPremium && !isSubscribed) {
      router.push('/choose-plan');
      return;
    }
    router.push(`/book/${book.id}/read`);
  };

  const handleListen = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('login'));
      return;
    }
    if (!book) return;
    const isPremium = !!book.subscriptionRequired;
    const isSubscribed = user?.subscription?.status === 'active';
    if (isPremium && !isSubscribed) {
      router.push('/choose-plan');
      return;
    }
    router.push(`/book/${book.id}/listen`);
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white text-[#032b41] py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-8 animate-pulse">
              <div className="lg:w-1/3">
                <div className="w-64 h-96 mx-auto rounded-lg bg-gray-200" />
              </div>
              <div className="lg:w-2/3 w-full">
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white text-[#032b41] py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-8 animate-pulse">
              <div className="lg:w-1/3">
                <div className="w-64 h-96 mx-auto rounded-lg bg-gray-200" />
              </div>
              <div className="lg:w-2/3 w-full">
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      {/* Hero Section */}
      <div className="bg-white text-[#032b41] py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/3">
              <div className="w-64 h-96 mx-auto relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={book.imageLink}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {book.subscriptionRequired && (
                  <div className="absolute top-4 right-4 bg-yellow-400 rounded-full p-2">
                    <BiCrown className="text-white text-lg" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:w-2/3 text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{book.title}</h1>
              <h2 className="text-xl mb-4">{book.subTitle}</h2>
              <p className="text-lg mb-6">by {book.author}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <AiFillStar className="text-yellow-400" />
                  <span>{book.averageRating}</span>
                  <span className="text-gray-500">({book.totalRating.toLocaleString()} ratings)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <AiFillClockCircle />
                  <span>{book.keyIdeas} key ideas</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="capitalize">{book.type}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                {book.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-[#032b41] px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleRead}
                  className="bg-[#2bd97c] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#25c470] transition-colors flex items-center justify-center gap-2"
                >
                  <AiFillBook />
                  Read
                </button>
                <button
                  onClick={handleListen}
                  className="border border-[#032b41] text-[#032b41] px-8 py-3 rounded-lg font-semibold hover:bg-[#2bd97c] hover:text-[#032b41] transition-colors flex items-center justify-center gap-2"
                >
                  <AiFillPlayCircle />
                  Listen
                </button>
                <button
                  onClick={handleBookmark}
                  className="border border-[#032b41] text-[#032b41] px-4 py-3 rounded-lg font-semibold hover:bg-[#2bd97c] hover:text-[#032b41] transition-colors flex items-center justify-center"
                >
                  {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'summary'
                  ? 'border-[#2bd97c] text-[#2bd97c]'
                  : 'border-transparent text-gray-600 hover:text-[#032b41]'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-[#2bd97c] text-[#2bd97c]'
                  : 'border-transparent text-gray-600 hover:text-[#032b41]'
              }`}
            >
              Details
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'summary' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#032b41] mb-4">What&apos;s it about?</h3>
                <p className="text-gray-700 leading-relaxed">
                  {(book.summary || '')
                    .trim()
                    .split(/\n\n|\r\n\r\n/)[0]
                    ?.split(/(?<=\.)\s+/)
                    .slice(0, 3)
                    .join(' ') || 'No summary available.'}
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[#032b41] mb-4">About the book</h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.bookDescription}
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[#032b41] mb-4">About the author</h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.authorDescription}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-[#032b41] mb-2">Book Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{book.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Author:</span>
                      <span className="font-medium">{book.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{book.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Key Ideas:</span>
                      <span className="font-medium">{book.keyIdeas}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-[#032b41] mb-2">Ratings & Reviews</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating:</span>
                      <span className="font-medium">{book.averageRating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Ratings:</span>
                      <span className="font-medium">{book.totalRating.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">{book.status.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subscription:</span>
                      <span className="font-medium">{book.subscriptionRequired ? 'Required' : 'Free'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;