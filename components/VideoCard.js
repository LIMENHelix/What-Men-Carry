'use client';

import { useState, useRef, useEffect } from 'react';

export default function VideoCard({ slug, title, file, poster, youtubeId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPlaying) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.unobserve(video);
  }, [isPlaying]);

  const handlePlayClick = () => {
    if (videoRef.current) {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleUnmute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <article className="group">
      <div className="relative bg-dark-800 overflow-hidden rounded-sm">
        <video
          ref={videoRef}
          className="w-full h-auto aspect-video bg-dark-900 object-cover"
          poster={poster}
          muted={isMuted}
          loop
          autoPlay
          playsInline
          preload="metadata"
        >
          <source src={`/videos/${file}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Controls overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button
            onClick={handlePlayClick}
            className="p-3 bg-amber hover:bg-amber/90 text-dark-900 rounded-full transition-colors"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleUnmute}
            className="p-3 bg-steel hover:bg-steel/90 text-dark-900 rounded-full transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5h-4v-2h4l5-5v12z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.1v2.7c2.89.86 5 3.54 5 6.8s-2.11 5.94-5 6.8v2.7c4.01-.91 7-4.49 7-9.5s-2.99-8.59-7-9.5z" />
            )}
          </button>

          {youtubeId && (
            <a
              href={`https://youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              aria-label="Watch on YouTube"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-4 font-serif text-lg leading-tight text-white group-hover:text-amber transition-colors">
        {title}
      </h3>
    </article>
  );
}
