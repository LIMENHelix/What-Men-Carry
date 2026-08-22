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
}

export default function VideoCard({ slug, file, title, theme, price = 0.50, quote, audio, youtubeId }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(() => {});
          audioRef.current?.play().catch(() => {});
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
  }, []);

  const handleVideoPlay = () => {
    audioRef.current?.play().catch(() => {});
  };

  const handleVideoPause = () => {
    audioRef.current?.pause();
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
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full bg-black"
          loop
          playsInline
          preload="metadata"
          poster={`/videos/${slug}-poster.jpg`}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
        >
          <source src={`/videos/${file}`} type="video/mp4" />
        </video>

        {audio && (
          <audio
            ref={audioRef}
            src={`/videos/${audio}`}
            loop
            preload="metadata"
          />
        )}

        {/* Quote overlay */}
        {quote && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black via-transparent to-transparent p-6 text-center">
            <p className="font-serif text-lg md:text-xl text-white leading-relaxed drop-shadow-lg">{quote}</p>
          </div>
        )}

        {/* Play indicator on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/40 flex items-center justify-center cursor-pointer">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
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

        <button
          onClick={handleBuyClick}
          disabled={isLoading}
          className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-black px-4 py-2 rounded font-semibold text-sm transition-all duration-200"
        >
          {isLoading ? 'Loading...' : `Buy $${price.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
