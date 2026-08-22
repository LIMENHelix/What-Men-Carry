'use client';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero - Crisis focus */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-serif mb-4">You Do Not Have to Carry This Alone</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Crisis resources. Real help. Confidential. Free.
          </p>
        </div>
      </section>

      {/* Crisis Numbers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-serif mb-8">In Crisis Right Now</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* 988 */}
          <div className="bg-gradient-to-br from-amber-900 to-gray-900 border-2 border-amber-500 rounded-lg p-8">
            <h3 className="font-serif text-2xl mb-2 text-amber-300">988</h3>
            <p className="text-gray-300 mb-4">Suicide and Crisis Lifeline</p>
            <div className="space-y-2 text-sm">
              <p><strong>Call:</strong> <a href="tel:988" className="crisis-link">988</a></p>
              <p><strong>Text:</strong> <a href="sms:988" className="crisis-link">988</a></p>
              <p className="text-gray-400 text-xs mt-2">Available 24/7. Free. Confidential. Trained counselors.</p>
            </div>
          </div>

          {/* Veterans Crisis */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-8">
            <h3 className="font-serif text-2xl mb-2">Veterans Crisis Line</h3>
            <p className="text-gray-300 mb-4">If you served or are in the military</p>
            <div className="space-y-2 text-sm">
              <p><strong>Call:</strong> <a href="tel:988" className="text-gray-200 hover:text-amber-500">988</a> then press <strong>1</strong></p>
              <p><strong>Text:</strong> <a href="sms:838255" className="text-gray-200 hover:text-amber-500">838255</a></p>
              <p className="text-gray-400 text-xs mt-2">Veterans talking to veterans.</p>
            </div>
          </div>

          {/* SAMHSA */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-8">
            <h3 className="font-serif text-2xl mb-2">Substance Use Help</h3>
            <p className="text-gray-300 mb-4">Alcohol, drugs, addiction treatment</p>
            <div className="space-y-2 text-sm">
              <p><strong>SAMHSA Helpline:</strong> <a href="tel:1-800-662-4357" className="text-gray-200 hover:text-amber-500 font-mono">1-800-662-4357</a></p>
              <p className="text-gray-400 text-xs mt-2">Free. Confidential. Referrals to local treatment.</p>
            </div>
          </div>

          {/* Other resources */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-8">
            <h3 className="font-serif text-2xl mb-2">Other Help</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.crisis.org" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-amber-500">Crisis Text Line: Text HOME to 741741</a></li>
              <li><a href="https://suicidepreventionlifeline.org" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-amber-500">National Suicide Prevention Lifeline</a></li>
              <li><a href="https://www.mentalhealth.gov" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-amber-500">MentalHealth.gov Resource Finder</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Organizations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-serif mb-8">Mens Mental Health Organizations</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              name: 'ManKind Initiative',
              desc: 'Mental health support specifically for men',
              url: 'https://www.mankindinitiative.org',
            },
            {
              name: 'Mens Resource Center',
              desc: 'Community resources and connection',
              url: 'https://www.mensresourcecenter.org',
            },
            {
              name: 'The Good Men Project',
              desc: 'Articles and community around mens issues',
              url: 'https://goodmenproject.com',
            },
            {
              name: 'It is OK to Talk',
              desc: 'Peer support networks for men',
              url: 'https://www.itsokaytonotbeokay.co.uk',
            },
          ].map((org) => (
            <a
              key={org.name}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition"
            >
              <h3 className="font-serif text-lg mb-2">{org.name}</h3>
              <p className="text-sm text-gray-400">{org.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
