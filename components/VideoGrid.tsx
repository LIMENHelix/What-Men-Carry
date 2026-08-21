'use client';

import VideoCard from './VideoCard';

interface Video {
  slug: string;
  file: string;
  title: string;
  theme: string;
  youtubeId?: string;
}

interface VideoGridProps {
  videos: Video[];
  filterTheme?: string;
}

export default function VideoGrid({ videos, filterTheme }: VideoGridProps) {
  const filtered = filterTheme
    ? videos.filter((v) => v.theme === filterTheme)
    : videos;

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No videos in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="video-grid">
      {filtered.map((video) => (
        <VideoCard key={video.slug} {...video} />
      ))}
    </div>
  );
}
