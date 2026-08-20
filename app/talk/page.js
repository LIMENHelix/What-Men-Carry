'use client';

import { useState } from 'react';

export default function Talk() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'd typically send the form data to an API endpoint
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', city: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 border-b border-dark-700 bg-gradient-to-r from-dark-900 via-dark-900 to-dark-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">Talk Spaces</h1>
          <p className="text-lg text-steel max-w-2xl">
            Not therapy. Not a lecture. Men, talking.
          </p>
        </div>
      </section>

      {/* What they are */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <h2 className="text-3xl font-serif font-bold mb-8">What Happens Here</h2>

        <div className="space-y-12">
          {/* What they are */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-amber">What they are:</h3>
            <ul className="space-y-3 text-lg text-steel list-disc list-inside">
              <li>Men sitting together, one table or one screen</li>
              <li>A chance to say the things you don't say at work or home</li>
              <li>No diagnosis. No solutions handed down. No "here's what you should do"</li>
              <li>Confidential. What's said here stays here</li>
              <li>Built on the idea that you are not alone</li>
            </ul>
          </div>

          {/* What they're not */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-amber">What they're not:</h3>
            <ul className="space-y-3 text-lg text-steel list-disc list-inside">
              <li>Professional therapy or counseling (though therapy is good—do it)</li>
              <li>A place to dump on others without care</li>
              <li>Judgment. No politics, no ego, no hierarchy</li>
              <li>Required to fix anything. You just show up</li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-amber">Men talk about:</h3>
            <p className="text-lg text-steel mb-4">
              Whatever's heavy. Work. Divorce. Kids. Money. Addiction. Sleep. Anger. Loneliness. Failure. Starting over. What it means to be a man. Why we can't ask for help. What we wish we'd known.
            </p>
            <p className="text-lg text-steel">
              One rule: Show up. Listen. Say what's true.
            </p>
          </div>
        </div>
      </section>

      {/* Signup form */}
      <section className="max-w-2xl mx-auto px-4 py-16 sm:py-24 border-t border-dark-700">
        <h2 className="text-3xl font-serif font-bold mb-8">Want In?</h2>

        {submitted ? (
          <div className="bg-dark-800 border-l-4 border-amber p-6 rounded-sm">
            <p className="text-lg font-serif mb-2">Thanks. We'll be in touch.</p>
            <p className="text-steel">Look for an email from us soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-condensed tracking-wider text-steel uppercase mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-white placeholder-steel focus:border-amber focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-condensed tracking-wider text-steel uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-white placeholder-steel focus:border-amber focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-condensed tracking-wider text-steel uppercase mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-white placeholder-steel focus:border-amber focus:outline-none transition-colors"
                placeholder="Where you are"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-condensed tracking-wider text-steel uppercase mb-2">
                What brings you here? (optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-white placeholder-steel focus:border-amber focus:outline-none transition-colors resize-none"
                placeholder="Tell us a bit about what you're looking for..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-amber text-dark-900 font-condensed font-bold tracking-wider hover:bg-amber/90 transition-colors"
            >
              Sign Me Up
            </button>
          </form>
        )}
      </section>

      {/* Support info */}
      <section className="bg-dark-800 py-12 px-4 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-steel mb-4">In crisis right now?</p>
          <p className="text-sm mb-4">
            <a href="tel:988" className="font-bold text-amber hover:text-amber/80">
              Call or text 988
            </a>
            {' '}
            <span className="text-steel">— available 24/7</span>
          </p>
        </div>
      </section>
    </>
  );
}
