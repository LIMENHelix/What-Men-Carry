'use client';

import { useState } from 'react';

export default function TalkPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    what_brings_you: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to form handler
    console.log('Form submitted:', formData);
    alert('Thank you. We'll be in touch.');
    setFormData({ name: '', email: '', city: '', what_brings_you: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-serif mb-2">Talk</h1>
        <p className="text-gray-400 text-lg">Not therapy. Not a lecture. Men, talking.</p>
      </section>

      {/* What & What Not */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-serif text-xl mb-4 text-amber-500">What It Is</h2>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>✓ Men sharing real problems</li>
              <li>✓ No judgment. No fixes.</li>
              <li>✓ Confidentiality</li>
              <li>✓ Regular, same time, same place</li>
              <li>✓ Free</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-4">What It Isn't</h2>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>✗ Therapy or counseling</li>
              <li>✗ Advice column</li>
              <li>✗ A business networking group</li>
              <li>✗ Twelve-step program</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-amber-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-amber-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-amber-500"
              placeholder="Where are you?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">What brings you here? (optional)</label>
            <textarea
              name="what_brings_you"
              value={formData.what_brings_you}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-amber-500"
              placeholder="Anything you want us to know"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Join
          </button>
        </form>
      </section>
    </div>
  );
}
