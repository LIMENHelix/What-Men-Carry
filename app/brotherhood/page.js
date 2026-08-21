import Link from 'next/link';
import fs from 'fs';
import path from 'path';

const events = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'content/events.json'), 'utf-8')
);

export default function Brotherhood() {
  const upcomingEvents = events.filter(
    (e) => new Date(e.date) > new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 border-b border-dark-700 bg-gradient-to-r from-dark-900 via-dark-900 to-dark-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">Brotherhood</h1>
          <p className="text-lg text-steel max-w-2xl">
            Runs. Camps. Meetups. Spaces where men show up for each other.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <h2 className="text-3xl font-serif font-bold mb-8">What We Do</h2>
        <div className="space-y-8 text-lg text-steel">
          <p>
            What Men Carry isn't just videos. It's the people who show up. Every week, men gather in cities across the country—for runs, for camps, for conversation—because we know that carrying the weight alone breaks you.
          </p>
          <p>
            <span className="text-amber font-serif">Warrior Boot Camps</span> are day-long intensives: physical challenge, honest talk, and men who get it.
          </p>
          <p>
            <span className="text-amber font-serif">Group Runs</span> happen rain or shine. No pace requirements. Come as you are.
          </p>
          <p>
            <span className="text-amber font-serif">Meetups</span> are simpler: coffee, conversation, no agenda. Just men.
          </p>
        </div>
      </section>

      {/* Events */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24 border-t border-dark-700">
        <h2 className="text-3xl font-serif font-bold mb-8">Upcoming Events</h2>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-steel mb-6">No events scheduled yet. Check back soon.</p>
            <p className="text-sm text-steel">Want to organize an event in your city?</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className="border-l-4 border-amber pl-6 py-4 bg-dark-800/50 p-6 rounded-sm"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold mb-2">{event.title}</h3>
                    <p className="text-steel mb-3">{event.city}</p>
                  </div>
                  <div className="text-right text-sm font-condensed tracking-wider">
                    <p className="text-amber font-bold">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-steel">{event.time}</p>
                  </div>
                </div>
                <p className="text-steel mb-4">{event.description}</p>
                <a
                  href={event.link || '#'}
                  className="inline-block text-sm font-condensed tracking-wider text-amber hover:text-amber/80 transition-colors"
                >
                  Learn More →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Start a chapter CTA */}
      <section className="bg-dark-800 py-16 sm:py-24 px-4 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">Start a Chapter</h2>
          <p className="text-lg text-steel mb-8">
            Don't see an event in your city? We'll help you organize one. Men leading men. That's how it works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@limenhelix.com?subject=Start%20a%20What%20Men%20Carry%20Chapter"
              className="inline-block px-8 py-4 bg-amber text-dark-900 font-condensed font-bold tracking-wider hover:bg-amber/90 transition-colors"
            >
              Get Started
            </a>
            <Link
              href="/resources"
              className="inline-block px-8 py-4 border-2 border-steel text-steel font-condensed font-bold tracking-wider hover:bg-steel/10 transition-colors"
            >
              Resources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
