'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface VideoCardProps {
  slug: string;
  file: string;
  title: string;
  theme: string;
  price?: number;
  quote?: string;
  audio?: string;
  youtubeId?: string;
  onVideoEnd?: () => void;
  isFeatured?: boolean;
}

export default function VideoCard({ slug, file, title, theme, price = 0.50, quote, audio, youtubeId, onVideoEnd, isFeatured }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(!isFeatured);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && videoRef.current && !isFeatured) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
          audioRef.current?.pause();
        }
      });
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [isFeatured]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
    if (newMuted) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (!isMuted) {
      audioRef.current?.play().catch(() => {});
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100 || 0);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
    setTimeout(() => {
      onVideoEnd?.();
    }, 1500);
  };

  const handleBuyClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, price }),
      });

      const { sessionId, error } = await response.json();
      if (error) throw new Error(error);

      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Checkout failed'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="video-card">
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video group" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          className="w-full h-full bg-black cursor-pointer"
          playsInline
          preload="metadata"
          poster={`/videos/${slug}-poster.jpg`}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          muted={isMuted}
        >
          <source src={`/videos/${file}`} type="video/mp4" />
        </video>

        {audio && (
          <audio
            ref={audioRef}
            src={`/videos/${audio}`}
            preload="metadata"
          />
        )}

        {/* Quote overlay */}
        {quote && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black via-transparent to-transparent p-6 text-center pointer-events-none">
            <p className="font-serif text-lg md:text-xl text-white leading-relaxed drop-shadow-lg">{quote}</p>
          </div>
        )}

        {/* Custom controls */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>

        {/* Mute button - bottom right */}
        <button
          onClick={handleMuteToggle}
          className="absolute bottom-2 right-2 z-10 pointer-events-auto bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17a2 2 0 002 2h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.172a1 1 0 011.414 0A6.972 6.972 0 0110 16a1 1 0 11-1-1 5.972 5.972 0 005.657-2.828.999.999 0 010-1.415A5.999 5.999 0 009 8a1 1 0 11-1-1 6.972 6.972 0 014.657-2.172z" />
            </svg>
          )}
        </button>

        {/* Progress bar - bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700">
          <div
            className="h-full bg-amber-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <h3 className="video-title">{title}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="capitalize px-2 py-1 bg-gray-800 rounded">{theme}</span>
            {youtubeId && (
              <Link href={`https://youtube.com/watch?v=${youtubeId}`} target="_blank" className="hover:text-amber-500 transition">
                Watch on YouTube
              </Link>
            )}
          </div>
        </div>

        {process.env.NEXT_PUBLIC_PURCHASES_ENABLED === 'true' && (
          <button
            onClick={handleBuyClick}
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-black px-4 py-2 rounded font-semibold text-sm transition-all duration-200"
          >
            {isLoading ? 'Loading...' : `Buy $${price.toFixed(2)}`}
          </button>
        )}
      </div>
    </div>
  );
}
