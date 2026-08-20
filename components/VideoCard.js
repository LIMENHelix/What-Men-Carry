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

  const handleAudioToggle = () => {
    setAudioEnabled(!audioEnabled);
    if (audioRef.current) {
      if (!audioEnabled) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

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

        {/* Audio toggle button */}
        {audioFile && (
          <button
            onClick={handleAudioToggle}
            className="absolute bottom-3 left-3 p-2 bg-amber/80 hover:bg-amber text-dark-900 rounded-full transition-colors opacity-0 hover:opacity-100"
            aria-label={audioEnabled ? 'Mute voiceover' : 'Enable voiceover'}
            title={audioEnabled ? 'Voiceover on' : 'Click to hear voiceover'}
          >
            {audioEnabled ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.1v2.7c2.89.86 5 3.54 5 6.8s-2.11 5.94-5 6.8v2.7c4.01-.91 7-4.49 7-9.5s-2.99-8.59-7-9.5z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40,22.99 3.50612381,23.1 4.13399899,22.9429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.05754193 C3.34915502,0.9 2.40734225,0.9429026 1.77946707,1.4141949 C0.994623095,2.0474611 0.837654326,3.1368539 1.15159189,3.92234774 L3.03521743,10.3633408 C3.03521743,10.5204382 3.19218622,10.6775356 3.50612381,10.6775356 L16.6915026,11.4630226 C16.6915026,11.4630226 17.1624089,11.4630226 17.1624089,12.0962888 C17.1624089,12.5675809 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            )}
          </button>
        )}

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
