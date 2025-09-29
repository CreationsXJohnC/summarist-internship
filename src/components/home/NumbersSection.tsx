'use client';

import { BiCrown } from 'react-icons/bi';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import { RiLeafLine } from 'react-icons/ri';

const NumbersSection = () => {
  const numbers = [
    {
      icon: <BiCrown className="text-4xl text-[#2bd97c]" />,
      title: "3 Million",
      subtitle: "Downloads on all platforms"
    },
    {
      icon: (
        <div className="flex items-center text-[#2bd97c]">
          <BsStarFill className="text-3xl" />
          <BsStarHalf className="text-3xl ml-1" />
        </div>
      ),
      title: "4.5 Stars", 
      subtitle: "Average ratings on iOS and Google Play"
    },
    {
      icon: <RiLeafLine className="text-4xl text-[#2bd97c]" />,
      title: "97%",
      subtitle: "Of our members create a better reading habit"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-[#032b41]">
          Start growing with Summarist now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {numbers.map((number, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {number.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#032b41]">
                {number.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {number.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NumbersSection;