'use client';

import { useRef, useEffect } from 'react';

export default function VideoCard({ slug, quote, file, poster, youtubeId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.unobserve(video);
  }, []);

  return (
    <article>
      <div className="relative bg-dark-800 overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-auto aspect-video bg-dark-900 object-cover"
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={`/videos/${file}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* YouTube link — corner overlay */}
        {youtubeId && (
          <a
            href={`https://youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-colors opacity-0 hover:opacity-100"
            aria-label="Watch on YouTube"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        )}
      </div>

      {/* Quote below frame — small, quiet */}
      <p className="mt-4 text-sm leading-snug text-steel font-serif">
        {quote}
      </p>
    </article>
  );
}
