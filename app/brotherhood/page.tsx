import eventsData from '@/content/events.json';

export default function BrotherhoodPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-serif mb-2">Brotherhood</h1>
        <p className="text-gray-400 text-lg">Runs. Camps. Meetups. Talk spaces.</p>
      </section>

      {/* Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-6">
          {eventsData.events.length > 0 ? (
            eventsData.events.map((event) => (
              <div key={event.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-serif">{event.title}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-800 rounded capitalize">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>📍 {event.location}</p>
                      <p>📅 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                      <p>📧 {event.contact}</p>
                    </div>
                  </div>
                  <a href={event.rsvp} target="_blank" rel="noopener noreferrer" className="btn-primary whitespace-nowrap">
                    RSVP
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">More events coming soon.</p>
            </div>
          )}
        </div>

        {/* Start a chapter CTA */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif mb-4">Start a Chapter in Your City</h2>
          <p className="text-gray-400 mb-6">
            Want to organize a run, boot camp, or talk space? Let&apos;s build.
          </p>
          <a href="mailto:chapters@limenhelix.com" className="btn-primary">
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
}
