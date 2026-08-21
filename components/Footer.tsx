import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-serif text-amber-500 mb-4">What Men Carry</div>
            <p className="text-sm text-gray-400">A community for men. Stories about the weight we carry.</p>
          </div>

          <div>
            <h3 className="font-serif text-sm text-gray-200 mb-4">Navigate</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-amber-500 transition">Home</Link></li>
              <li><Link href="/series" className="text-gray-400 hover:text-amber-500 transition">The Series</Link></li>
              <li><Link href="/brotherhood" className="text-gray-400 hover:text-amber-500 transition">Brotherhood</Link></li>
              <li><Link href="/talk" className="text-gray-400 hover:text-amber-500 transition">Talk</Link></li>
              <li><Link href="/resources" className="text-gray-400 hover:text-amber-500 transition">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm text-gray-200 mb-4">Watch</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://youtube.com/@limenhelix" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition">YouTube</a></li>
              <li><a href="https://instagram.com/limenhelix" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition">Instagram</a></li>
              <li><a href="https://facebook.com/limenhelix" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition">Facebook</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm text-gray-200 mb-4">In Crisis</h3>
            <div className="space-y-2 text-sm">
              <div>
                <a href="tel:988" className="crisis-link">988</a>
                <p className="text-xs text-gray-500 mt-1">Call or text anytime</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 LIMEN Helix. All rights reserved.</p>
          <p>What Men Carry — Stories $0.99</p>
        </div>
      </div>
    </footer>
  );
}
