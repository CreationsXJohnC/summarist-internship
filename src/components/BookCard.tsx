'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/data/mockBooks';
import { AiFillStar, AiFillClockCircle } from 'react-icons/ai';
import { BiCrown } from 'react-icons/bi';

interface BookCardProps {
  book: Book;
  size?: 'small' | 'medium' | 'large';
}

const BookCard: React.FC<BookCardProps> = ({ book, size = 'medium' }) => {
  const sizeClasses = {
    small: {
      container: 'w-40',
      image: 'h-48',
      title: 'text-sm',
      author: 'text-xs',
      details: 'text-xs'
    },
    medium: {
      container: 'w-48',
      image: 'h-56',
      title: 'text-base',
      author: 'text-sm',
      details: 'text-sm'
    },
    large: {
      container: 'w-56',
      image: 'h-64',
      title: 'text-lg',
      author: 'text-base',
      details: 'text-sm'
    }
  };

  const classes = sizeClasses[size];

  return (
    <Link href={`/book/${book.id}`}>
      <div className={`${classes.container} group cursor-pointer`}>
        <div className={`${classes.image} relative overflow-hidden rounded-lg shadow-md mb-3 group-hover:shadow-lg transition-shadow duration-300`}>
          <Image
            src={book.imageLink}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          
          {/* Subscription Badge */}
          {book.subscriptionRequired && (
            <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1.5">
              <BiCrown className="text-white text-sm" />
            </div>
          )}
          
          {/* Status Badge */}
          {book.status === 'progress' && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              In Progress
            </div>
          )}
          
          {book.status === 'completed' && (
            <div className="absolute top-2 left-2 bg-[#2bd97c] text-white text-xs px-2 py-1 rounded-full font-medium">
              Completed
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className={`${classes.title} font-semibold text-[#032b41] line-clamp-2 group-hover:text-[#2bd97c] transition-colors`}>
            {book.title}
          </h3>
          
          <p className={`${classes.author} text-gray-600 line-clamp-1`}>
            {book.author}
          </p>
          
          <p className={`${classes.title} text-gray-500 line-clamp-1 capitalize`}>
            {book.subTitle}
          </p>
          
          <div className={`${classes.details} flex items-center gap-3 text-gray-500 mt-2`}>
            <div className="flex items-center gap-1">
              <AiFillStar className="text-yellow-400" />
              <span>{book.averageRating}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <AiFillClockCircle />
              <span>{book.keyIdeas} ideas</span>
            </div>
          </div>
          
          <div className={`${classes.details} flex flex-wrap gap-1 mt-2`}>
            {book.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
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