export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 border-b border-dark-700">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">About</h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <h2 className="text-3xl font-serif font-bold mb-8">What Men Carry</h2>

        <div className="space-y-8 text-lg text-steel leading-loose">
          <p>
            What Men Carry is a platform built on one belief: men don't have to carry the weight alone.
          </p>

          <p>
            We started with video. Twenty-five seconds at a time. Stories about the things men don't usually talk about—divorce, fatherhood, loss, addiction, PTSD, work, responsibility, the slow decay of hope—distilled into moments that feel true.
          </p>

          <p>
            But video alone isn't enough. So we built the other part: a place where men can actually show up. Real meetups. Real conversations. Real community.
          </p>

          <h3 className="text-2xl font-serif font-bold mt-12 mb-6 text-white">We believe:</h3>

          <ul className="space-y-4 text-lg">
            <li className="flex gap-4">
              <span className="text-amber font-serif flex-shrink-0">•</span>
              <span>Men are dying by suicide at rates that demand better. We're part of that better.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-amber font-serif flex-shrink-0">•</span>
              <span>Most "men's health" content is clinical or corporate. We're neither. We're just honest.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-amber font-serif flex-shrink-0">•</span>
              <span>Community is the cure that research forgot. Men need other men.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-amber font-serif flex-shrink-0">•</span>
              <span>You don't have to be broken to be part of this. You just have to be human.</span>
            </li>
          </ul>

          <h3 className="text-2xl font-serif font-bold mt-12 mb-6 text-white">Made by LIMEN Helix</h3>

          <p>
            What Men Carry is built by LIMEN Helix, a platform for collected wisdom about the hard things—stress, recovery, the work of staying alive and well.
          </p>

          <p>
            We don't sell you anything. We don't run ads. We're here because this matters.
          </p>

          <p className="text-amber font-serif">
            If you need immediate support, call or text 988. Always.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-800 py-16 sm:py-24 px-4 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Join Us</h2>
          <p className="text-lg text-steel mb-8">
            Watch the videos. Come to an event. Start one. Talk. Listen. Be the man someone else needed to find.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-block px-8 py-4 bg-amber text-dark-900 font-condensed font-bold tracking-wider hover:bg-amber/90 transition-colors"
            >
              Home
            </a>
            <a
              href="/series"
              className="inline-block px-8 py-4 border-2 border-steel text-steel font-condensed font-bold tracking-wider hover:bg-steel/10 transition-colors"
            >
              The Series
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
