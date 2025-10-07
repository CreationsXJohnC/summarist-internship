'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Book } from '@/store/slices/booksSlice';
import { BiCrown } from 'react-icons/bi';

const TranscriptPage = () => {
  const params = useParams();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookId = params.id as string;

    const fetchBookById = async () => {
      try {
        const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data as Book);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
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
            setLoading(false);
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
  }, [params.id, router]);

  if (loading || !book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#032b41] mb-4">Loading transcript...</h2>
          <p className="text-gray-600">Please wait while we prepare the content.</p>
        </div>
      </div>
    );
  }

  const transcriptText = (book.summary && book.summary.trim().length > 0)
    ? book.summary
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Book Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-16 relative overflow-hidden rounded">
              <Image
                src={book.imageLink}
                alt={book.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <h1 className="font-semibold text-[#032b41]">{book.title}</h1>
              <p className="text-gray-600 text-sm">{book.author}</p>
            </div>
            {book.subscriptionRequired && (
              <span className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-[#032b41] text-[#032b41]">
                <BiCrown /> Premium
              </span>
            )}
          </div>

          {/* Transcript Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-[#032b41] mb-4">Transcript</h2>
            {transcriptText ? (
              <div className="prose prose-lg max-w-none leading-relaxed text-gray-800">
                {transcriptText
                  .split(/\n\n|\r\n\r\n/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>
            ) : (
              <p className="text-gray-700">Transcript is not available for this book.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptPage;