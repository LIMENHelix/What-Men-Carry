'use client';

import { useState } from 'react';
import VideoGrid from '@/components/VideoGrid';
import videosData from '@/content/videos.json';

const THEMES = ['All', 'responsibility', 'fatherhood', 'divorce', 'loss', 'work', 'ptsd', 'recovery'];

export default function SeriesPage() {
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-serif mb-2">The Series</h1>
        <p className="text-gray-400 text-lg">All stories. All themes.</p>
      </section>

      {/* Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme === 'All' ? undefined : theme)}
              className={`px-4 py-2 rounded text-sm transition ${
                (theme === 'All' && !selectedTheme) || selectedTheme === theme
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <VideoGrid videos={videosData.videos} filterTheme={selectedTheme} />
      </section>
    </div>
  );
}
