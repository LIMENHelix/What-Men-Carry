import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import videos from '@/content/videos.json';

export default function Home() {
  const featured = videos[0];

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800">
        <div className="max-w-3xl text-center">
          <h1 className="mb-8 leading-tight">
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4">
              The Weight We Carry
            </span>
            <span className="text-steel text-2xl sm:text-3xl font-serif font-light">
              Men talking about what matters.
            </span>
          </h1>
          <p className="text-lg text-steel mb-12 max-w-2xl mx-auto font-light">
            Twenty-five-second stories about fatherhood, loss, work, divorce, recovery, and the brotherhood we find when we show up.
          </p>
          <Link
            href="/series"
            className="inline-block px-8 py-4 bg-amber text-dark-900 font-condensed font-bold tracking-wider hover:bg-amber/90 transition-colors"
          >
            Watch The Series
          </Link>
        </div>
      </section>

      {/* Featured Video */}
      {featured && (
        <section className="max-w-5xl mx-auto px-4 py-20 sm:py-32">
          <div className="mb-12">
            <p className="text-sm font-condensed tracking-wider text-steel uppercase mb-6">Featured</p>
            <VideoCard
              slug={featured.slug}
              title={featured.title}
              file={featured.file}
              poster={featured.poster}
              youtubeId={featured.youtubeId}
            />
          </div>
        </section>
      )}

      {/* Grid of recent videos */}
      <section className="max-w-6xl mx-auto px-4 py-20 sm:py-32">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-12">Latest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.slice(1).map((video) => (
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
