'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { Book } from '@/data/mockBooks';
import { 
  AiFillPlayCircle, 
  AiFillPauseCircle, 
  AiFillStepBackward, 
  AiFillStepForward,
  AiFillSound,
  AiFillClockCircle
} from 'react-icons/ai';
import { BiCrown } from 'react-icons/bi';
import { BsBookmark, BsBookmarkFill, BsFillPlayFill } from 'react-icons/bs';
import { MdSpeed } from 'react-icons/md';

const AudioPlayerPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useSelector((state: any) => state.auth);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [book, setBook] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;
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
  }, [hasHydrated, params.id, isAuthenticated, router]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [book]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSpeedChange = (speed: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = speed;
    setPlaybackRate(speed);
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  const formatDurationLabel = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes} mins ${seconds} secs`;
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (!hasHydrated) {
    return null;
  }
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
    <div className="min-h-screen bg-gray-50 text-[#032b41]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="text-[#032b41] hover:text-[#2bd97c] transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleBookmark}
            className="text-[#032b41] hover:text-[#2bd97c] transition-colors text-xl"
          >
            {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Screenshot-styled Header */}
          <div className="bg-[#f2f4ef] text-[#032b41] rounded-xl p-6 mb-12">
            <div className="flex items-center">
              {/* Left blurb */}
              <div className="flex-1 pr-8">
                <h2 className="font-semibold mb-2">How Constant Innovation Creates Radically Successful Businesses</h2>
                <p className="text-sm text-[#6b7c93]">Selected just for you</p>
              </div>

              {/* Vertical divider */}
              <div className="w-px h-24 bg-gray-300 mx-4 hidden md:block" />

              {/* Right side: cover + meta */}
              <div className="flex-1 flex items-center gap-6">
                <div className="w-20 h-28 relative overflow-hidden rounded shadow">
                  <Image src={book.imageLink} alt={book.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{book.title}</h3>
                  <p className="text-sm text-[#6b7c93]">{book.author}</p>
                </div>
                {/* Play + duration label */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayPause}
                    className="w-10 h-10 rounded-full bg-[#2bd97c] flex items-center justify-center shadow hover:shadow-md transition"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <AiFillPauseCircle className="text-white text-xl" />
                    ) : (
                      <AiFillPlayCircle className="text-white text-xl" />
                    )}
                  </button>
                  <span className="text-sm text-[#032b41]">{formatDurationLabel(duration || 203)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Audio Element (controlled by fixed bottom player) */}
          <div className="sr-only">
            <audio
              ref={audioRef}
              src={book.audioLink}
              preload="metadata"
            />
          </div>

          {/* Book Summary / Transcript */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">{book.subscriptionRequired ? "What you'll learn" : 'Transcript'}</h3>
            {book.subscriptionRequired ? (
              <p className="text-lg leading-relaxed opacity-90">
                {book.summary}
              </p>
            ) : (
              <div className="prose prose-lg max-w-none leading-relaxed text-gray-800">
                {`The Lean Startup is a book by entrepreneur and startup consultant Eric Ries that offers a methodology for building successful startups. The book is based on Ries’ experiences working with startups, and his belief that many of the traditional approaches to building a business are flawed and can lead to wasted resources and failure. The Lean Startup offers a new approach to entrepreneurship that emphasizes rapid iteration, customer feedback, and a focus on delivering value to the customer.

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
The Lean Startup is a must-read for anyone interested in building a successful startup. Ries’ methodology is based on years of experience working with startups, and his insights into the key factors that contribute to startup success are both powerful and actionable. By embracing the principles of the Lean Startup, entrepreneurs can minimize the risk of failure and maximize their chances of building a sustainable, successful business.`.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#083043] text-white py-3">
        <div className="container mx-auto px-4 flex items-center gap-4">
          {/* Left: Cover + Meta */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-10 h-14 relative overflow-hidden rounded">
              <Image src={book.imageLink} alt={book.title} fill className="object-cover" sizes="40px" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold truncate max-w-[160px]">{book.title}</div>
              <div className="text-xs text-gray-200 truncate max-w-[160px]">{book.author}</div>
            </div>
          </div>

          {/* Middle: Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => skipTime(-10)}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Skip back 10 seconds"
            >
              <AiFillStepBackward className="text-2xl" />
            </button>
            <button
              onClick={togglePlayPause}
              className="bg-white text-[#032b41] rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <AiFillPauseCircle className="text-3xl" />
              ) : (
                <AiFillPlayCircle className="text-3xl" />
              )}
            </button>
            <button
              onClick={() => skipTime(10)}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Skip forward 10 seconds"
            >
              <AiFillStepForward className="text-2xl" />
            </button>
          </div>

          {/* Right: Timeline + Duration */}
          <div className="flex-1 flex items-center gap-3 min-w-[280px]">
            <span className="text-xs font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2bd97c 0%, #2bd97c ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.2) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <span className="text-xs font-mono">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2bd97c;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2bd97c;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default AudioPlayerPage;