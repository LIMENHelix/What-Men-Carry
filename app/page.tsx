'use client';

import { useState, useRef } from 'react';
import VideoCard from '@/components/VideoCard';
import VideoGrid from '@/components/VideoGrid';
import videosData from '@/content/videos.json';

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videosRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleFeaturedVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videosData.videos.length);
  };

  const handleGridVideoEnd = (index: number) => {
    setCurrentVideoIndex((prev) => {
      const nextIndex = prev + 1;
      return nextIndex >= videosData.videos.length ? 0 : nextIndex;
    });
  };

  const currentVideo = videosData.videos[currentVideoIndex];

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center relative bg-gradient-to-b from-gray-900 to-black px-4">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-serif leading-tight">
            What Men Carry
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Stories about the weight. Mental health. Real voices. A community.
          </p>

          {/* Featured video carousel */}
          {currentVideo && (
            <div className="mt-12 w-full max-w-2xl">
              <VideoCard
                slug={currentVideo.slug}
                file={currentVideo.file}
                title={currentVideo.title}
                quote={currentVideo.quote}
                theme={currentVideo.theme}
                audio={currentVideo.audio}
                youtubeId={currentVideo.youtubeId}
                onVideoEnd={handleFeaturedVideoEnd}
                isFeatured={true}
              />
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-serif mb-2">The Collection</h2>
          <p className="text-gray-400">More stories. All themes.</p>
        </div>
        <VideoGrid videos={videosData.videos} onVideoEnd={handleGridVideoEnd} />
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-serif">Not alone.</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Watch the videos. Join the runs. Talk to men who get it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/brotherhood" className="btn-primary">Find Your Brotherhood</a>
            <a href="/talk" className="btn-secondary">Join a Talk Space</a>
          </div>
        </div>
      </section>
    </div>
  );
}
