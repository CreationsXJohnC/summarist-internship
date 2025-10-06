'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Book } from '@/data/mockBooks';
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
      } catch (err) {
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

  const transcript = `The Lean Startup is a book by entrepreneur and startup consultant Eric Ries that offers a methodology for building successful startups. The book is based on Ries’ experiences working with startups, and his belief that many of the traditional approaches to building a business are flawed and can lead to wasted resources and failure. The Lean Startup offers a new approach to entrepreneurship that emphasizes rapid iteration, customer feedback, and a focus on delivering value to the customer.

Part One: Vision
The first section of The Lean Startup introduces the key concepts and principles of the lean startup methodology. Ries argues that traditional approaches to entrepreneurship are based on a flawed assumption that startups can simply follow a linear process to success, starting with a well-defined business plan and executing that plan flawlessly. He argues that in reality, startups are much more complex and uncertain, and that the key to success is to be able to navigate this uncertainty by constantly iterating and learning from customer feedback.

Part Two: Steer
The second section of The Lean Startup explores the process of steering a startup towards success. Ries argues that startups should focus on delivering value to the customer as quickly and efficiently as possible, and that the best way to do this is by using a process of continuous experimentation and iteration. He also emphasizes the importance of measuring progress and using data to inform decision-making, and offers insights into the types of metrics that are most valuable for startups.

Part Three: Accelerate
The third section of The Lean Startup focuses on strategies for accelerating the growth of a startup. Ries argues that startups should focus on building a scalable business model that can be rapidly expanded once product-market fit has been established. He also offers advice on how to build a strong team, how to manage resources effectively, and how to create a culture of innovation and experimentation.

Key Themes
The Lean Startup is a powerful and influential book that has revolutionized the way many entrepreneurs approach building a business. Some of the key themes of the book include:

Rapid Iteration: The Lean Startup emphasizes the importance of rapid iteration and experimentation in building a successful startup. By quickly testing new ideas and incorporating customer feedback, startups can minimize the risk of failure and maximize the chances of success.

Customer Focus: The Lean Startup places a strong emphasis on delivering value to the customer. By focusing on what the customer wants and needs, startups can create products and services that are more likely to succeed in the market.

Data-Driven Decision Making: The Lean Startup encourages startups to use data to inform decision-making. By measuring progress and using data to track key metrics, startups can make more informed decisions and avoid wasting resources on initiatives that are unlikely to succeed.

Continuous Improvement: The Lean Startup advocates for a culture of continuous improvement, in which startups are constantly looking for ways to improve their products and processes. By embracing a mindset of continuous improvement, startups can stay ahead of the competition and build sustainable long-term success.

Conclusion
The Lean Startup is a must-read for anyone interested in building a successful startup. Ries’ methodology is based on years of experience working with startups, and his insights into the key factors that contribute to startup success are both powerful and actionable. By embracing the principles of the Lean Startup, entrepreneurs can minimize the risk of failure and maximize their chances of building a sustainable, successful business.`;

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
            <div className="prose prose-lg max-w-none leading-relaxed text-gray-800">
              {transcript.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptPage;