'use client';

import { useRef, useEffect, useState } from 'react';

export default function VideoCard({ slug, quote, file, poster, audioFile, youtubeId }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
          if (audioEnabled && audio) {
            audio.currentTime = 0;
            audio.play();
          }
        } else {
          video.pause();
          if (audio) audio.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.unobserve(video);
  }, [audioEnabled]);

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

        {audioFile && (
          <audio ref={audioRef} preload="metadata">
            <source src={`/audio/${audioFile}`} type="audio/mpeg" />
          </audio>
        )}

        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-3">
          {audioFile && (
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="px-3 py-1 text-xs bg-amber text-dark-900 font-bold rounded hover:bg-amber/90"
            >
              {audioEnabled ? 'Voiceover ON' : 'Voiceover'}
            </button>
          )}

          {youtubeId && (
            <a
              href={`https://youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs bg-red-600 text-white font-bold rounded hover:bg-red-700"
            >
              YouTube
            </a>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-snug text-steel font-serif">
        {quote}
      </p>
    </article>
  );
}
