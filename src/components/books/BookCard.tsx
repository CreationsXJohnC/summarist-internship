'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AiFillStar, AiFillClockCircle } from 'react-icons/ai';
import { BiCrown } from 'react-icons/bi';
import { Book } from '@/data/mockBooks';

interface BookCardProps {
  book: Book;
  size?: 'small' | 'medium' | 'large';
}

const BookCard = ({ book, size = 'medium' }: BookCardProps) => {
  const sizeClasses = {
    small: 'w-32 h-48',
    medium: 'w-40 h-60',
    large: 'w-48 h-72'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <Link href={`/book/${book.id}`} className="group block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 h-full">
        <div className="relative mb-4">
          <div className={`${sizeClasses[size]} mx-auto relative overflow-hidden rounded-lg`}>
            <Image
              src={book.imageLink}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {book.subscriptionRequired && (
              <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1">
                <BiCrown className="text-white text-sm" />
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className={`font-semibold text-[#032b41] line-clamp-2 group-hover:text-[#2bd97c] transition-colors ${textSizeClasses[size]}`}>
            {book.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-1">
            {book.author}
          </p>
          
          <p className="text-gray-500 text-xs line-clamp-2">
            {book.subTitle}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <AiFillStar className="text-yellow-400" />
              <span>{book.averageRating}</span>
              <span>({book.totalRating.toLocaleString()})</span>
            </div>
            
            <div className="flex items-center gap-1">
              <AiFillClockCircle />
              <span>{book.keyIdeas} key ideas</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {book.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;