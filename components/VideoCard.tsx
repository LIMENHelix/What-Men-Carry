'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface VideoCardProps {
  slug: string;
  file: string;
  title: string;
  theme: string;
  youtubeId?: string;
}

export default function VideoCard({ slug, file, title, theme, youtubeId }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(() => {
            // autoplay may be blocked, that's ok
          });
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      });
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="video-card">
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full aspect-video bg-black"
          muted
          loop
          playsInline
          preload="metadata"
          poster={`/videos/${slug}-poster.jpg`}
        >
          <source src={`/videos/${file}`} type="video/mp4" />
        </video>

        {/* Play indicator on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/40 flex items-center justify-center cursor-pointer">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-3">
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
    </div>
  );
}
