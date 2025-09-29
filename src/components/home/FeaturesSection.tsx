'use client';

import { AiFillFileText, AiFillBulb, AiFillAudio } from 'react-icons/ai';

const FeaturesSection = () => {
  const features = [
    {
      icon: <AiFillFileText className="text-4xl text-[#2bd97c]" />,
      title: "Read or listen",
      subtitle: "Save time by getting the core ideas from the best books."
    },
    {
      icon: <AiFillBulb className="text-4xl text-[#2bd97c]" />,
      title: "Find your next read",
      subtitle: "Explore book lists and personalized recommendations."
    },
    {
      icon: <AiFillAudio className="text-4xl text-[#2bd97c]" />,
      title: "Briefcasts",
      subtitle: "Gain valuable insights from briefcasts"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-[#032b41]">
          Understand books in few minutes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#032b41]">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;