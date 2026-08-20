import VideoCard from '@/components/VideoCard';
import videos from '@/content/videos.json';

export default function Series() {
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

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        {videos.length === 0 ? (
          <p className="text-center text-steel py-12">No videos yet.</p>
        ) : (
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
        )}
      </section>
    </>
  );
}
