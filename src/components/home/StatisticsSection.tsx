'use client';

const StatisticsSection = () => {
  const leftStats = [
    {
      number: "93%",
      title: "of Summarist members significantly increase reading frequency."
    },
    {
      number: "96%",
      title: "of Summarist members establish better habits."
    },
    {
      number: "90%",
      title: "have made significant positive change to their lives."
    }
  ];

  const rightStats = [
    {
      number: "91%",
      title: "of Summarist members report feeling more productive after incorporating the service into their daily routine."
    },
    {
      number: "94%",
      title: "of Summarist members have noticed an improvement in their overall comprehension and retention of information."
    },
    {
      number: "88%",
      title: "of Summarist members feel more informed about current events and industry trends since using the platform."
    }
  ];

  const leftHeadings = [
    "Enhance your knowledge",
    "Achieve greater success", 
    "Improve your health",
    "Develop better parenting skills",
    "Increase happiness",
    "Be the best version of yourself!"
  ];

  const rightHeadings = [
    "Expand your learning",
    "Accomplish your goals",
    "Strengthen your vitality", 
    "Become a better caregiver",
    "Improve your mood",
    "Maximize your abilities"
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* First Statistics Block */}
        <div className="flex flex-col lg:flex-row items-center mb-20">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <div className="space-y-4">
              {leftHeadings.map((heading, index) => (
                <h3 key={index} className="text-2xl font-semibold text-[#032b41]">
                  {heading}
                </h3>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 space-y-8">
            {leftStats.map((stat, index) => (
              <div key={index} className="flex items-start">
                <div className="text-4xl font-bold text-[#2bd97c] mr-6 min-w-[80px]">
                  {stat.number}
                </div>
                <div className="text-gray-700 text-lg">
                  <span dangerouslySetInnerHTML={{ __html: stat.title.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Statistics Block */}
        <div className="flex flex-col lg:flex-row-reverse items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pl-10">
            <div className="space-y-4">
              {rightHeadings.map((heading, index) => (
                <h3 key={index} className="text-2xl font-semibold text-[#032b41]">
                  {heading}
                </h3>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 space-y-8">
            {rightStats.map((stat, index) => (
              <div key={index} className="flex items-start">
                <div className="text-4xl font-bold text-[#2bd97c] mr-6 min-w-[80px]">
                  {stat.number}
                </div>
                <div className="text-gray-700 text-lg">
                  <span dangerouslySetInnerHTML={{ __html: stat.title.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;