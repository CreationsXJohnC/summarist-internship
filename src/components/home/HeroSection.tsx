'use client';

import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '@/store/slices/uiSlice';

const HeroSection = () => {
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    dispatch(openAuthModal('login'));
  };

  return (
    <section className="bg-white text-[#032b41] py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pl-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Gain more knowledge <br />
              <span className="text-[#2bd97c]">in less time</span>
            </h1>
            <p className="text-lg mb-8 text-[#032b41]">
              Great summaries for busy people,
              <br />
              individuals who barely have time to read,
              <br />
              and even people who don't like to read.
            </p>
            <button
              onClick={handleLoginClick}
              className="bg-[#2bd97c] text-[#032b41] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#20ba68] transition-colors duration-300"
            >
              Login
            </button>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <Image
                src="/assets/landing.png"
                alt="Landing illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;