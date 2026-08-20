'use client';

import { useState, useMemo } from 'react';
import VideoCard from '@/components/VideoCard';
import videos from '@/content/videos.json';

const THEMES = [
  'All',
  'Fatherhood',
  'Divorce',
  'Work',
  'PTSD',
  'Loss',
  'Recovery',
  'Addiction',
  'Responsibility',
];

export default function Series() {
  const [selectedTheme, setSelectedTheme] = useState('All');

  const filteredVideos = useMemo(() => {
    if (selectedTheme === 'All') return videos;
    return videos.filter((v) => v.theme === selectedTheme);
  }, [selectedTheme]);

  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 border-b border-dark-700">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">The Series</h1>
          <p className="text-lg text-steel max-w-2xl">
            Twenty-five seconds. One story. No explanation needed.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 bg-dark-800/95 backdrop-blur border-b border-dark-700 py-6 px-4 z-40">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-condensed tracking-wider text-steel uppercase mb-4">Filter by theme</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`px-4 py-2 text-sm font-condensed tracking-wider transition-colors ${
                  selectedTheme === theme
                    ? 'bg-amber text-dark-900 font-bold'
                    : 'bg-dark-700 text-steel hover:text-amber'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        {filteredVideos.length === 0 ? (
          <p className="text-center text-steel py-12">No videos in this theme yet.</p>
        ) : (
          <>
            <p className="text-sm text-steel mb-8">
              {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.slug}
                  slug={video.slug}
                  title={video.title}
                  file={video.file}
                  poster={video.poster}
                  youtubeId={video.youtubeId}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
