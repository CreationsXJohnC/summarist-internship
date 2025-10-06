'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Book } from '@/data/mockBooks';
import { AiFillClockCircle, AiFillBook } from 'react-icons/ai';
import { BiCrown } from 'react-icons/bi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { MdTextIncrease, MdTextDecrease } from 'react-icons/md';

const ReadingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  
  const [book, setBook] = useState<Book | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [readingProgress, setReadingProgress] = useState(0);

  // Mock reading content - in a real app, this would come from the API
  const mockContent = `
    Chapter 1: The Foundation of Success

    Success is not a destination, but a journey of continuous growth and learning. In this comprehensive guide, we explore the fundamental principles that separate high achievers from the rest.

    The Power of Habits

    Our daily habits shape our destiny more than any single decision we make. Research shows that approximately 40% of our daily actions are performed out of habit, not conscious decision-making. This means that by changing our habits, we can literally transform our lives.

    Consider the compound effect of small, consistent actions. A person who reads for just 30 minutes a day will consume approximately 50 books per year. Over a decade, that's 500 books - enough knowledge to become an expert in multiple fields.

    The Mindset Revolution

    Your mindset is the lens through which you view the world. A growth mindset believes that abilities and intelligence can be developed through dedication and hard work. This view creates a love of learning and resilience that is essential for great accomplishment.

    Fixed mindset individuals believe their basic abilities, intelligence, and talents are fixed traits. They spend their time documenting their intelligence or talent instead of developing them. They also believe that talent alone creates success—without effort.

    Building Your Success Framework

    1. Define Your Vision: What does success look like for you? Be specific and write it down.

    2. Set Clear Goals: Break your vision into achievable, measurable goals with deadlines.

    3. Develop Daily Habits: Create routines that move you closer to your goals every day.

    4. Embrace Failure: View setbacks as learning opportunities, not permanent defeats.

    5. Surround Yourself with Growth: Choose relationships and environments that challenge and inspire you.

    The Science of Achievement

    Neuroscience research reveals that our brains are remarkably plastic. We can literally rewire our neural pathways through consistent practice and focused attention. This means that the skills and mindsets required for success can be developed at any age.

    The key is understanding that mastery requires deliberate practice - focused, goal-oriented practice that pushes you beyond your comfort zone. This type of practice is often uncomfortable, but it's the only way to achieve true expertise.

    Chapter 2: The Daily Disciplines

    Excellence is not an act, but a habit. The most successful people in the world have mastered the art of daily disciplines - small, consistent actions that compound over time to create extraordinary results.

    Morning Rituals

    How you start your day sets the tone for everything that follows. Successful individuals often share similar morning routines:

    - Early rising (typically between 5-6 AM)
    - Physical exercise or movement
    - Meditation or mindfulness practice
    - Reading or learning
    - Planning and goal review

    These activities prime the brain for peak performance and create momentum that carries throughout the day.

    The Power of Focus

    In our age of constant distraction, the ability to focus deeply has become a superpower. Research by Cal Newport shows that the ability to focus without distraction on a cognitively demanding task is becoming increasingly rare - and increasingly valuable.

    Deep work, as Newport calls it, is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information and produce better results in less time.

    Time Management Mastery

    Time is our most precious resource, yet most people manage it poorly. The most effective approach to time management involves:

    1. Time blocking: Scheduling specific blocks of time for different activities
    2. The 80/20 rule: Focusing on the 20% of activities that produce 80% of results
    3. Elimination: Saying no to non-essential commitments
    4. Batch processing: Grouping similar tasks together

    Continuous Learning

    The half-life of skills is shrinking rapidly. What you learned in school may be obsolete within a few years. The solution is to become a lifelong learner, constantly updating and expanding your knowledge base.

    The most successful people read voraciously, attend seminars, hire coaches, and seek out mentors. They understand that learning is not a phase of life, but a way of life.

    Chapter 3: Overcoming Obstacles

    Every journey to success is filled with obstacles, setbacks, and challenges. The difference between those who succeed and those who don&#39;t is not the absence of obstacles, but the ability to overcome them.

    Resilience Building

    Resilience is like a muscle - it grows stronger with use. Each time you face a challenge and push through it, you build your capacity to handle future difficulties.

    Key strategies for building resilience include:

    - Reframing challenges as opportunities
    - Building a strong support network
    - Practicing stress management techniques
    - Maintaining perspective during difficult times
    - Learning from failure and setbacks

    The Fear Factor

    Fear is often the biggest obstacle to success. Fear of failure, fear of rejection, fear of success - these emotions can paralyze us and prevent us from taking the actions necessary to achieve our goals.

    The antidote to fear is action. When we take action despite our fears, we prove to ourselves that we're capable of more than we imagined. Each small act of courage builds our confidence and reduces the power of fear over our lives.

    Conclusion

    Success is not about perfection - it's about progress. It's about becoming a little bit better each day, building habits that serve your goals, and persisting through challenges with resilience and determination.

    Remember, the journey of a thousand miles begins with a single step. Take that step today, and then take another tomorrow. Before you know it, you'll have traveled further than you ever thought possible.

    The principles in this book are not just theories - they're proven strategies used by the most successful people in the world. Apply them consistently, and you too can achieve extraordinary results in your life.
  `;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const bookId = params.id as string;

    const fetchBookById = async () => {
      try {
        const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data as Book);
          return;
        }
      } catch (err) {
        // ignore and try fallback
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
  }, [params.id, isAuthenticated, router]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 14));
  };

  // If not authenticated, routing logic elsewhere should open modal or redirect; don't replace page with a full-screen block.

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#032b41] mb-4">Book Not Found</h2>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-[#2bd97c] transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-1 bg-white shadow-sm border-b z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-[#032b41] hover:text-[#2bd97c] transition-colors"
              >
                ← Back
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative overflow-hidden rounded">
                  <Image
                    src={book.imageLink}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <h1 className="font-semibold text-[#032b41] text-sm">{book.title}</h1>
                  <p className="text-gray-600 text-xs">{book.author}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Font Size Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseFontSize}
                  className="p-2 text-[#032b41] hover:text-[#2bd97c] transition-colors"
                  title="Decrease font size"
                >
                  <MdTextDecrease className="text-lg" />
                </button>
                <span className="text-sm text-gray-600">{fontSize}px</span>
                <button
                  onClick={increaseFontSize}
                  className="p-2 text-[#032b41] hover:text-[#2bd97c] transition-colors"
                  title="Increase font size"
                >
                  <MdTextIncrease className="text-lg" />
                </button>
              </div>

              <button
                onClick={handleBookmark}
                className="p-2 text-[#032b41] hover:text-[#2bd97c] transition-colors"
                title="Bookmark"
              >
                {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Book Header */}
          <div className="text-center mb-12">
            <div className="w-32 h-48 mx-auto mb-6 relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src={book.imageLink}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {book.subscriptionRequired && (
                <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1">
                  <BiCrown className="text-white text-sm" />
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-[#032b41] mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{book.author}</p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <AiFillClockCircle />
                <span>{book.keyIdeas} key ideas</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <AiFillBook />
                <span className="capitalize">{book.type}</span>
              </div>
            </div>
          </div>

          {/* Reading Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
            <div 
              className="prose prose-lg max-w-none leading-relaxed text-gray-800"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
            >
              {mockContent.split('\n\n').map((paragraph, index) => {
                if (paragraph.trim().startsWith('Chapter')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-[#032b41] mt-8 mb-4">
                      {paragraph.trim()}
                    </h2>
                  );
                }
                
                if (paragraph.trim() && !paragraph.trim().startsWith(' ')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-[#032b41] mt-6 mb-3">
                      {paragraph.trim()}
                    </h3>
                  );
                }
                
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  );
                }
                
                return null;
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t">
            <button
              onClick={() => router.push(`/book/${book.id}`)}
              className="bg-gray-100 text-[#032b41] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              ← Back to Book Details
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Reading Progress</p>
              <div className="text-lg font-semibold text-[#2bd97c]">
                {Math.round(readingProgress)}%
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/book/${book.id}/listen`)}
              className="bg-[#2bd97c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#25c470] transition-colors"
            >
              Listen Instead →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;