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
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#032b41] mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to listen to books.</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-[#032b41] to-[#2bd97c] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-300 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleBookmark}
            className="text-white hover:text-gray-300 transition-colors text-xl"
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
                    onClick={() => router.push(`/book/${book.id}/listen/transcript`)}
                    className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow hover:shadow-md transition"
                    aria-label="Play"
                  >
                    <BsFillPlayFill className="text-white text-xl" />
                  </button>
                  <span className="text-sm text-[#032b41]">{formatDurationLabel(duration || 203)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <audio
              ref={audioRef}
              src={book.audioLink}
              preload="metadata"
            />
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #2bd97c 0%, #2bd97c ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={() => skipTime(-15)}
                className="text-white hover:text-gray-300 transition-colors text-2xl"
              >
                <AiFillStepBackward />
              </button>
              
              <button
                onClick={() => router.push(`/book/${book.id}/listen/transcript`)}
                className="bg-white text-[#032b41] rounded-full p-4 hover:bg-gray-100 transition-colors"
                aria-label="Open transcript"
              >
                <AiFillPlayCircle className="text-4xl" />
              </button>
              
              <button
                onClick={() => skipTime(15)}
                className="text-white hover:text-gray-300 transition-colors text-2xl"
              >
                <AiFillStepForward />
              </button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between">
              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <AiFillSound className="text-lg" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2">
                <MdSpeed className="text-lg" />
                <select
                  value={playbackRate}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="bg-white bg-opacity-20 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="0.5" className="text-black">0.5x</option>
                  <option value="0.75" className="text-black">0.75x</option>
                  <option value="1" className="text-black">1x</option>
                  <option value="1.25" className="text-black">1.25x</option>
                  <option value="1.5" className="text-black">1.5x</option>
                  <option value="2" className="text-black">2x</option>
                </select>
              </div>
            </div>
          </div>

          {/* Book Summary */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">What you'll learn</h3>
            <p className="text-lg leading-relaxed opacity-90">
              {book.summary}
            </p>
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