import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import fs from 'fs';
import path from 'path';

const videos = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'content/videos.json'), 'utf-8')
);

export default function Home() {
  const featured = videos[0];

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-12">
            She held his hand. He held the rest.
          </h1>
          <Link
            href="/series"
            className="inline-block px-8 py-4 bg-amber text-dark-900 font-condensed font-bold tracking-wider hover:bg-amber/90 transition-colors"
          >
            Watch The Series
          </Link>
        </div>
      </section>

      {/* Video Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20 sm:py-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {videos.map((video) => (
            <VideoCard
              key={video.slug}
              slug={video.slug}
              quote={video.quote}
              file={video.file}
              poster={video.poster}
              audioFile={video.audioFile}
              youtubeId={video.youtubeId}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark-800 py-20 sm:py-32 px-4 mt-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
            More than videos
          </h2>
          <p className="text-lg text-steel mb-12">
            Find your people. Join a meetup. Start a chapter in your city. No one carries this alone.
          </p>
          <Link
            href="/brotherhood"
            className="inline-block px-8 py-4 bg-amber text-dark-900 font-condensed font-bold tracking-wider hover:bg-amber/90 transition-colors mr-4 mb-4"
          >
            Join Brotherhood
          </Link>
          <Link
            href="/talk"
            className="inline-block px-8 py-4 border-2 border-steel text-steel font-condensed font-bold tracking-wider hover:bg-steel/10 transition-colors"
          >
            Talk Spaces
          </Link>
        </div>
      </section>
    </>
  );
}
