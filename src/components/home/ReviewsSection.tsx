'use client';

import { BsStarFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '@/store/slices/uiSlice';

const ReviewsSection = () => {
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    dispatch(openAuthModal('login'));
  };

  const reviews = [
    {
      name: "Hanna M.",
      review: "This app has been a game-changer for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers."
    },
    {
      name: "David B.", 
      review: "I love this app! It provides concise and accurate summaries of books in a way that is easy to understand. It's also very user-friendly and intuitive."
    },
    {
      name: "Nathan S.",
      review: "This app is a great way to get the main takeaways from a book without having to read the entire thing. The summaries are well-written and informative. Definitely worth downloading."
    },
    {
      name: "Ryan R.",
      review: "If you're a busy person who loves reading but doesn't have the time to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-[#032b41]">
          What our members say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-[#032b41]">{review.name}</h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <BsStarFill key={i} className="text-sm" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <span dangerouslySetInnerHTML={{ 
                  __html: review.review.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') 
                }} />
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={handleLoginClick}
            className="bg-[#2bd97c] text-[#032b41] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#20ba68] transition-colors duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;