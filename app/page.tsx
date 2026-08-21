import VideoGrid from '@/components/VideoGrid';
import videosData from '@/content/videos.json';

export default function Home() {
  const featuredVideo = videosData.videos[0];

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

          {/* Featured video in hero */}
          {featuredVideo && (
            <div className="mt-12 rounded-lg overflow-hidden">
              <video
                className="w-full max-w-2xl aspect-video bg-black"
                controls
                playsInline
                preload="metadata"
                poster={`/videos/${featuredVideo.slug}-poster.jpg`}
              >
                <source src={`/videos/${featuredVideo.file}`} type="video/mp4" />
              </video>
              <div className="mt-3">
                <p className="font-serif text-lg text-gray-200">{featuredVideo.title}</p>
              </div>
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
        <VideoGrid videos={videosData.videos} />
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
