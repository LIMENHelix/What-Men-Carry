export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-20 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Crisis line */}
        <div className="mb-12 pb-12 border-b border-dark-700">
          <p className="text-xs font-condensed tracking-wider text-steel mb-3 uppercase">Crisis Support</p>
          <p className="text-sm mb-4">
            <a href="tel:988" className="font-bold text-amber hover:text-amber">Call or text 988</a>
            {' '}
            <span className="text-steel">— Suicide & Crisis Lifeline</span>
          </p>
          <p className="text-sm">
            <a href="tel:838255" className="font-bold text-amber hover:text-amber">Text 838255</a>
            {' '}
            <span className="text-steel">— Veterans Crisis Line</span>
          </p>
          <p className="text-sm">
            <a href="tel:1-800-662-4357" className="font-bold text-amber hover:text-amber">1-800-662-4357</a>
            {' '}
            <span className="text-steel">— SAMHSA (Substance Use)</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          {/* Navigation */}
          <div>
            <p className="text-xs font-condensed tracking-wider text-steel mb-4 uppercase">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-amber transition-colors">Home</a></li>
              <li><a href="/series" className="hover:text-amber transition-colors">The Series</a></li>
              <li><a href="/brotherhood" className="hover:text-amber transition-colors">Brotherhood</a></li>
              <li><a href="/talk" className="hover:text-amber transition-colors">Talk Spaces</a></li>
              <li><a href="/resources" className="hover:text-amber transition-colors">Resources</a></li>
              <li><a href="/about" className="hover:text-amber transition-colors">About</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-condensed tracking-wider text-steel mb-4 uppercase">Follow</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://youtube.com/@LIMENHelix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/limenhelix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/limenhelix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber transition-colors"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-dark-700 text-center text-xs text-steel">
          <p>© 2026 LIMEN Helix. All rights reserved.</p>
          <p className="mt-2">What Men Carry is a platform for community and recovery, not a substitute for professional care.</p>
        </div>
      </div>
    </footer>
  );
}
