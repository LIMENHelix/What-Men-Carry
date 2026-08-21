export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-serif mb-8">About</h1>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <p className="text-lg">
            What Men Carry is a community built on the belief that men can talk about what we're actually going through.
          </p>

          <p>
            Too many of us carry the weight alone. Divorce. Loss of custody. PTSD. Addiction. Suicide in the family. The weight of being the one who's supposed to have it together while falling apart.
          </p>

          <p>
            The videos are short. Cinematic. One line. They're not therapy—they're mirror.
          </p>

          <p>
            The community is real. Runs. Boot camps. Talk spaces. Men, actually talking.
          </p>

          <p>
            What Men Carry is a project of LIMEN Helix. We build tools and communities for people in hard seasons. This is one of them.
          </p>

          <p className="text-amber-500 font-serif text-lg mt-12">
            If you're carrying something, you're not alone.
          </p>
        </div>

        <div className="mt-16 bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h2 className="font-serif text-xl mb-4">LIMEN Helix</h2>
          <p className="text-gray-400 text-sm mb-4">
            LIMEN is Latin for threshold—the space between what was and what comes next. Helix is structure. We build at the threshold.
          </p>
          <a href="https://limenhelix.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400">
            Learn more at LIMEN Helix →
          </a>
        </div>
      </section>
    </div>
  );
}
